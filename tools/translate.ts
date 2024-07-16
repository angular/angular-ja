/**
 * @fileoverview GoogleのGenerative AIを使ってMarkdownファイルを翻訳します。
 *
 * 動作には Google AI Studio の API キーが必要です。
 * https://aistudio.google.com/app/apikey
 * 発行した API キーは環境変数 GOOGLE_API_KEY に設定してください。
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { consola } from 'consola';
import assert from 'node:assert';
import { readFile, writeFile } from 'node:fs/promises';
import { parseArgs } from 'node:util';

async function main() {
  const apiKey = process.env.GOOGLE_API_KEY;
  assert(apiKey, 'GOOGLE_API_KEY 環境変数が設定されていません。');
  const genAI = new GoogleGenerativeAI(apiKey);

  const args = parseArgs({ allowPositionals: true });
  const [file] = args.positionals;
  assert(file, 'ファイルを指定してください。');

  consola.start(`次のファイルを翻訳します: ${file}`);

  const fileContent = await readFile(file, 'utf-8');
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent([
    '技術文書のMarkdownファイルです。元のファイルの構造は保ったまま、本文中の英語を日本語に翻訳してください。内容の説明は出力せず、翻訳後のファイルだけをそのまま出力してください。',
    {
      inlineData: {
        data: Buffer.from(fileContent).toString('base64'),
        mimeType: 'text/markdown',
      },
    },
  ]);
  const translatedContent = result.response.text();
  consola.log(translatedContent);

  // 元のファイル拡張子が .en.* の場合は .* として保存する
  const outFilePath = file.replace(/\.en\.([^.]+)$/, '.$1');
  consola.ready(`翻訳結果の保存先: ${outFilePath}`);
  const save = await consola.prompt('翻訳結果を保存しますか？(y/N)', {
    type: 'confirm',
    initial: false,
  });
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
