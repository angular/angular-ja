/**
 * @fileoverview GoogleのGenerative AIを使ってMarkdownファイルを翻訳します。
 *
 * 動作には Google AI Studio の API キーが必要です。
 * https://aistudio.google.com/app/apikey
 * 発行した API キーは環境変数 GOOGLE_API_KEY に設定してください。
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import { consola } from 'consola';
import assert from 'node:assert';
import { stat, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { glob } from './lib/fsutils';
import { rootDir } from './lib/workspace';

const apiKey = process.env.GOOGLE_API_KEY;
assert(apiKey, 'GOOGLE_API_KEY 環境変数が設定されていません。');
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  systemInstruction: `
あなたはWebフロントエンドに関する技術文書の翻訳アシスタントです。
Markdownファイルを受け取り、英語を日本語に翻訳した結果を出力してください。
翻訳作業は以下のルールを遵守してください。
- 元のMarkdownの文書構造を維持してください。
- 内容の説明は含めず、翻訳結果のみを出力してください。
- コードブロックの中身は翻訳しないでください。
- "TIP: ", "HELPFUL: ", "IMPORTANT: "など、ヒントや注意書きを示すプレフィックスは変更しないでください。
`.trim(),
});

async function main() {
  const args = parseArgs({
    options: { write: { type: 'boolean', default: false } },
    allowPositionals: true,
  });
  const { write } = args.values;
  const [target] = args.positionals;
  assert(target, 'ファイルまたはディレクトリを指定してください。');

  const stats = await stat(target);
  if (stats.isFile()) {
    await translateFile(target, write);
  } else if (stats.isDirectory()) {
    await translateDir(target, write);
  }
}

async function translateDir(dir: string, forceWrite = false) {
  const files = await glob('**/*.en.md', { cwd: dir });
  const selectedFiles = await consola.prompt(
    `翻訳するファイルを選択してください`,
    {
      type: 'multiselect',
      required: false,
      options: files,
    }
  );
  if (selectedFiles.length === 0) {
    return;
  }

  for (const file of selectedFiles) {
    await translateFile(resolve(dir, file), forceWrite);
  }
}

async function translateFile(file: string, forceWrite = false) {
  consola.start(`ファイルを翻訳します: ${file}`);
  // Upload files for translation
  const prhFile = await fileManager.uploadFile(resolve(rootDir, 'prh.yml'), {
    mimeType: 'text/plain',
    displayName: 'prh.yml',
  });
  const contentFile = await fileManager.uploadFile(file, {
    mimeType: 'text/markdown',
    displayName: `content.md`,
  });
  // Execute translation
  const result = await model.generateContentStream([
    {
      fileData: {
        mimeType: contentFile.file.mimeType,
        fileUri: contentFile.file.uri,
      },
    },
    {
      fileData: {
        mimeType: prhFile.file.mimeType,
        fileUri: prhFile.file.uri,
      },
    },
    `content.md を日本語に翻訳してください。`,
    `prh.yml は日本語の校正ルールが書かれたYAMLファイルです。ルールに従って翻訳後のテキストを修正してください。`,
  ]);
  // Show translation result
  process.stdout.write('\n----\n');
  const chunks: string[] = [];
  for await (const chunk of result.stream) {
    const text = chunk.text();
    chunks.push(text);
    process.stdout.write(text);
  }
  process.stdout.write('\n----\n');

  consola.success('翻訳完了');
  const translatedContent = chunks.join('');

  // 元のファイル拡張子が .en.* の場合は .* として保存する
  const outFilePath = file.replace(/\.en\.([^.]+)$/, '.$1');
  const save =
    forceWrite ||
    (await consola.prompt(`翻訳結果を保存しますか？\n保存先: ${outFilePath}`, {
      type: 'confirm',
      initial: false,
    }));
  if (!save) {
    return;
  }
  await writeFile(outFilePath, translatedContent);
  consola.success(`保存しました`);
}

main().catch((error) => {
  consola.error(error);
  process.exit(1);
});
