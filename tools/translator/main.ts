import consola from 'consola';
import assert from 'node:assert';
import { readFile, writeFile } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { cli } from 'textlint';
import { globby } from 'globby';
import pLimit from 'p-limit';
import {
  cpRf,
  exists,
  getEnFilePath,
  getLocalizedFilePath,
} from '../lib/fsutils';
import { MarkdownTranslator } from './translate';

/**
 * CLI引数の型定義
 */
interface CliArgs {
  pattern: string;
  write?: boolean;
  concurrency?: number;
  force?: boolean;
  help?: boolean;
}

/**
 * 翻訳に必要な環境変数の検証
 */
function validateEnvironment(): { googleApiKey: string; geminiModel?: string } {
  const googleApiKey = process.env.GOOGLE_API_KEY;
  const geminiModel = process.env.GEMINI_MODEL;

  assert(googleApiKey, 'GOOGLE_API_KEY 環境変数が設定されていません。');

  return { googleApiKey, geminiModel };
}

/**
 * ヘルプメッセージの表示
 * ユーザーにCLIの使用方法を提供するため
 */
function showHelp(): void {
  console.log(`
使用方法: npx tsx tools/translator/main.ts [オプション] <パターン>

Markdownファイルを日本語に翻訳します。

オプション:
  -w, --write            確認なしで翻訳結果を保存
  -c, --concurrency <n>  並列処理数（デフォルト: 2）
  --force                翻訳済みファイルを再翻訳
  -h, --help             このヘルプメッセージを表示

引数:
  <パターン>  翻訳するMarkdownファイルのパスまたはglobパターン

環境変数:
  GOOGLE_API_KEY  Google AI API キー（必須）
  GEMINI_MODEL    使用するGeminiモデル（オプション）

例:
  npx tsx tools/translator/main.ts example.md
  npx tsx tools/translator/main.ts -w "adev-ja/src/content/guide/*.md"
  npx tsx tools/translator/main.ts -w -c 5 "adev-ja/src/content/**/*.md"
  npx tsx tools/translator/main.ts -w --force "adev-ja/src/content/guide/*.md"
`);
}

/**
 * コマンドライン引数の解析と検証
 */
function parseCliArgs(): CliArgs {
  const args = parseArgs({
    options: {
      write: { type: 'boolean', default: false, short: 'w' },
      concurrency: { type: 'string', default: '2', short: 'c' },
      force: { type: 'boolean', default: false },
      help: { type: 'boolean', default: false, short: 'h' },
    },
    allowPositionals: true,
  });

  const { write, help, force } = args.values;
  const concurrency = parseInt(args.values.concurrency || '2', 10);
  const [pattern] = args.positionals;

  if (help) {
    showHelp();
    process.exit(0);
  }

  if (!pattern) {
    showHelp();
    throw new Error('ファイルパスまたはglobパターンを指定してください。');
  }

  if (isNaN(concurrency) || concurrency < 1) {
    throw new Error('並列数は1以上の整数で指定してください。');
  }

  return { write, pattern, concurrency, force, help };
}

/**
 * glob パターンからファイルリストを収集
 */
async function collectFiles(pattern: string, force: boolean): Promise<string[]> {
  const files = await globby(pattern, {
    ignore: ['**/*.en.md', '**/*.en.ts', '**/*.en.json'],
  });

  if (files.length === 0) {
    throw new Error(`パターンに一致するファイルが見つかりません: ${pattern}`);
  }

  // force が false の場合、翻訳済みファイルをフィルタリング
  if (!force) {
    const untranslatedFiles: string[] = [];
    for (const file of files) {
      const enFile = getEnFilePath(file);
      if (!(await exists(enFile))) {
        untranslatedFiles.push(file);
      }
    }
    return untranslatedFiles;
  }

  return files;
}

/**
 * ファイルの翻訳処理実行
 */
async function translateFile(
  file: string,
  googleApiKey: string,
  geminiModel?: string
): Promise<string> {
  const translator = new MarkdownTranslator(googleApiKey, geminiModel);
  const content = await readFile(file, 'utf-8');
  return translator.translate(content);
}

/**
 * 原文ファイルの自動生成
 */
async function ensureEnglishFile(originalFile: string): Promise<void> {
  const enFile = getEnFilePath(originalFile);
  if (!(await exists(enFile))) {
    consola.warn(
      `原文ファイルが見つかりません。入力ファイルを ${enFile} にコピーします。`
    );
    await cpRf(originalFile, enFile);
  }
}

/**
 * 保存確認のユーザープロンプト
 */
async function promptForSave(outputFile: string): Promise<boolean> {
  return consola.prompt(`翻訳結果を保存しますか？\n保存先: ${outputFile}`, {
    type: 'confirm',
    initial: false,
  });
}

/**
 * 翻訳結果の保存処理
 */
async function saveTranslation(
  file: string,
  content: string,
  forceWrite: boolean
): Promise<string | null> {
  const outputFile = getLocalizedFilePath(file);
  const shouldSave = forceWrite || (await promptForSave(outputFile));

  if (!shouldSave) {
    consola.info('翻訳結果は保存されませんでした。');
    return null;
  }

  await ensureEnglishFile(file);
  await writeFile(outputFile, content);
  consola.success(`翻訳結果を保存しました: ${outputFile}`);
  return outputFile;
}

/**
 * 翻訳ファイルと原文ファイルの行数比較バリデーション
 */
async function validateLineCount(
  originalFile: string,
  translatedFile: string
): Promise<void> {
  async function getLineCount(filePath: string) {
    const content = await readFile(filePath, 'utf-8');
    return content.split('\n').length;
  }

  const [originalLines, translatedLines] = await Promise.all([
    getLineCount(originalFile),
    getLineCount(translatedFile),
  ]);

  const lineDiff = Math.abs(originalLines - translatedLines);

  if (lineDiff === 0) {
    consola.success(`行数バリデーション: OK`);
  } else {
    consola.warn(
      `行数バリデーション: 注意 - 原文: ${originalLines}行, 翻訳: ${translatedLines}行 (差分: ${lineDiff}行`
    );
  }
}

/**
 * textlintの実行
 */
async function runTextlint(file: string): Promise<void> {
  const ok = await cli.execute(`${file}`).then((code) => code === 0);
  if (ok) {
    consola.success(`textlint: OK`);
  } else {
    consola.warn(
      `textlint: エラーが検出されました。修正が完了してから提出してください。`
    );
  }
}

/**
 * 単一ファイルの翻訳処理（エラーハンドリング含む）
 */
async function processSingleFile(
  file: string,
  googleApiKey: string,
  geminiModel: string | undefined,
  forceWrite: boolean
): Promise<{ file: string; success: boolean; error?: Error }> {
  try {
    consola.start(`翻訳開始: ${file}`);

    const translated = await translateFile(file, googleApiKey, geminiModel);
    const savedFile = await saveTranslation(file, translated, forceWrite);

    if (!savedFile) {
      return { file, success: false };
    }

    // 翻訳結果の分析
    await validateLineCount(getEnFilePath(savedFile), savedFile);
    await runTextlint(savedFile);

    consola.success(`翻訳完了: ${file}`);
    return { file, success: true };
  } catch (error) {
    consola.warn(`翻訳失敗: ${file}`);
    return { file, success: false, error: error as Error };
  }
}

/**
 * アプリケーションのメインエントリーポイント
 */
async function main() {
  const { write, pattern, concurrency, force } = parseCliArgs();
  const { googleApiKey, geminiModel } = validateEnvironment();

  // ファイルリスト収集
  const files = await collectFiles(pattern, !!force);

  if (files.length === 0) {
    consola.warn('翻訳対象のファイルがありません。');
    return;
  }

  consola.info(`翻訳対象: ${files.length}件 (並列数: ${concurrency})`);

  // 並列処理制御
  const limit = pLimit(concurrency!);
  const results = await Promise.all(
    files.map((file) =>
      limit(() => processSingleFile(file, googleApiKey, geminiModel, !!write))
    )
  );

  // 最終サマリー表示
  const succeeded = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  // エラー詳細を一時ファイルに保存
  let errorLogPath: string | null = null;
  if (failed.length > 0) {
    errorLogPath = join(tmpdir(), `translate-errors-${Date.now()}.log`);
    const errorDetails = failed
      .map((r) => {
        const errorStack = r.error?.stack || r.error?.message || 'Unknown error';
        return `\n${'='.repeat(80)}\nファイル: ${r.file}\n${'='.repeat(80)}\n${errorStack}\n`;
      })
      .join('\n');

    await writeFile(errorLogPath, errorDetails, 'utf-8');
  }

  if (failed.length === 0) {
    consola.success('翻訳完了');
  } else {
    consola.warn('翻訳完了（一部失敗）');
  }

  consola.info(`成功: ${succeeded.length}件`);
  consola.info(`失敗: ${failed.length}件`);

  if (failed.length > 0) {
    console.log('\n失敗したファイル:');
    failed.forEach((r) => console.log(r.file));
  }

  if (errorLogPath) {
    consola.info(`エラー詳細: ${errorLogPath}`);
  }

  if (failed.length > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  consola.error(error);
  process.exit(1);
});
