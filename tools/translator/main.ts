import consola from 'consola';
import assert from 'node:assert';
import { readFile, writeFile } from 'node:fs/promises';
import { parseArgs } from 'node:util';
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
  file: string;
  write?: boolean;
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
使用方法: npx tsx tools/translator/main.ts [オプション] <ファイルパス>

Markdownファイルを日本語に翻訳します。

オプション:
  -w, --write    確認なしで翻訳結果を保存
  -h, --help     このヘルプメッセージを表示

引数:
  <ファイルパス>  翻訳するMarkdownファイルのパス

環境変数:
  GOOGLE_API_KEY  Google AI API キー（必須）
  GEMINI_MODEL    使用するGeminiモデル（オプション）

例:
  npx tsx tools/translator/main.ts example.md
  npx tsx tools/translator/main.ts -w example.md
`);
}

/**
 * コマンドライン引数の解析と検証
 */
function parseCliArgs(): CliArgs {
  const args = parseArgs({
    options: {
      write: { type: 'boolean', default: false, short: 'w' },
      help: { type: 'boolean', default: false, short: 'h' },
    },
    allowPositionals: true,
  });

  const { write, help } = args.values;
  const [file] = args.positionals;

  if (help) {
    showHelp();
    process.exit(0);
  }

  if (!file) {
    showHelp();
    throw new Error('ファイルパスを指定してください。');
  }

  return { write, file, help };
}

/**
 * ファイルの存在確認
 */
async function validateFileExistence(file: string): Promise<void> {
  const fileExists = await exists(file);
  if (!fileExists) {
    throw new Error(`ファイルが見つかりません: ${file}`);
  }
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
): Promise<void> {
  const outputFile = getLocalizedFilePath(file);
  const shouldSave = forceWrite || (await promptForSave(outputFile));

  if (!shouldSave) {
    return;
  }

  await ensureEnglishFile(file);
  await writeFile(outputFile, content);
  consola.success(`保存しました`);
}

/**
 * アプリケーションのメインエントリーポイント
 */
async function main() {
  const { write, file } = parseCliArgs();
  const { googleApiKey, geminiModel } = validateEnvironment();

  await validateFileExistence(file);

  consola.start(`Starting translation for ${file}`);

  const translated = await translateFile(file, googleApiKey, geminiModel);

  console.log(translated);
  await saveTranslation(file, translated, !!write);
}

main().catch((error) => {
  consola.error(error);
  process.exit(1);
});
