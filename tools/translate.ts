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
import {
  cpRf,
  exists,
  getEnFilePath,
  getLocalizedFilePath,
  getWordCount,
  glob,
} from './lib/fsutils';
import { rootDir } from './lib/workspace';

const apiKey = process.env.GOOGLE_API_KEY;
assert(apiKey, 'GOOGLE_API_KEY 環境変数が設定されていません。');
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash-002',
  systemInstruction: `
あなたは技術文書の翻訳アシスタントです。
Markdown形式のテキストを受け取り、テキスト中の英文を日本語に翻訳してください。以下のルールを遵守してください。
- 翻訳するのは英文のみです。コードブロックは翻訳しないてください。
- 出力するのは翻訳結果だけです。内容の説明や補足は不要です。
- 見出しのレベルを維持してください。
- 改行やインデントの数を維持してください。
- 英単語の前後にスペースを入れないでください。
- Note/Tip/HELPFUL/IMPORTANT/QUESTION/TLDR/CRITICAL から始まるプレフィックスは翻訳せず、そのまま出力してください。
- prh.yml に書かれた日本語の校正ルールに従って翻訳してください。出力に prh.yml は不要です。
`.trim(),
});

async function main() {
  const args = parseArgs({
    options: {
      text: { type: 'string', default: '', short: 't' },
      write: { type: 'boolean', default: false, short: 'w' },
    },
    allowPositionals: true,
  });
  const { write, text } = args.values;
  const [target] = args.positionals;

  if (text) {
    await translateText(text);
  } else {
    assert(target, 'ファイルまたはディレクトリを指定してください。');

    const stats = await stat(target);
    if (stats.isFile()) {
      await translateFile(target, write);
    } else if (stats.isDirectory()) {
      await translateDir(target, write);
    }
  }
}

async function translateText(text: string) {
  // Upload files for translation
  const prhFile = await fileManager.uploadFile(resolve(rootDir, 'prh.yml'), {
    mimeType: 'text/plain',
    displayName: 'prh.yml',
  });
  const translatedContent = await model
    .generateContent([
      {
        fileData: {
          mimeType: prhFile.file.mimeType,
          fileUri: prhFile.file.uri,
        },
      },
      `次のテキストを日本語に翻訳した結果を出力してください。\n`,
      text,
    ])
    .then(({ response }) => response.text());

  process.stdout.write(translatedContent);
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
  consola.info(`翻訳中...`);
  const wordCound = await getWordCount(file);
  if (wordCound < 10000) {
    const translatedContent = await model
      .generateContent([
        {
          fileData: {
            mimeType: prhFile.file.mimeType,
            fileUri: prhFile.file.uri,
          },
        },
        {
          fileData: {
            mimeType: contentFile.file.mimeType,
            fileUri: contentFile.file.uri,
          },
        },
        `content.md を日本語に翻訳した結果を出力してください。`,
      ])
      .then(({ response }) => response.text());
    await writeTranslatedContent(file, translatedContent, forceWrite);
  } else {
    consola.warn(
      `ファイルが大きいため、いくつかの断片に分割して翻訳されます。翻訳後の整合性に注意してください。`
    );
    const translationChunks: string[] = [];
    const chat = await model.startChat({ history: [] });
    let count = 1;
    const maxCount = 20;
    let lastTranslationChunk = await chat
      .sendMessage([
        {
          fileData: {
            mimeType: prhFile.file.mimeType,
            fileUri: prhFile.file.uri,
          },
        },
        {
          fileData: {
            mimeType: contentFile.file.mimeType,
            fileUri: contentFile.file.uri,
          },
        },
        `content.md を日本語に翻訳してください。翻訳結果のテキストを100行ずつに分割して。その1番目の部分を出力してください。`,
      ])
      .then(({ response }) => response.text().trim());
    while (count < maxCount) {
      consola.log(`\n---- 翻訳結果 (${count}) ----\n`);
      consola.log(lastTranslationChunk);
      translationChunks.push(lastTranslationChunk);
      translationChunks.push(`<!-- TRANSLATION_CHUNK -->`);

      // Continue translation
      count++;
      const chunk = await chat
        .sendMessage(
          `続けて、翻訳結果の${count}番目の部分を出力してください。${count}番目が存在しなければ「EOF」と出力してください`
        )
        .then(({ response }) => response.text().trim());
      // Abort if infinite loop detected
      if (chunk === 'EOF' || lastTranslationChunk === chunk) {
        break;
      }
      lastTranslationChunk = chunk;
    }
    consola.success('翻訳完了');
    const translatedContent = translationChunks.join('\n');
    await writeTranslatedContent(file, translatedContent, forceWrite);
  }
}

async function writeTranslatedContent(
  file: string,
  content: string,
  forceWrite = false
) {
  const outputFile = getLocalizedFilePath(file);
  const save =
    forceWrite ||
    (await consola.prompt(`翻訳結果を保存しますか？\n保存先: ${outputFile}`, {
      type: 'confirm',
      initial: false,
    }));
  if (!save) {
    return;
  }

  const enFile = getEnFilePath(file);
  // .en.* が存在しない場合は原文コピーを忘れているため、.en.md に元ファイルをコピーする
  if (!(await exists(enFile))) {
    consola.warn(
      `原文ファイルが見つかりません。入力ファイルを ${enFile} にコピーします。`
    );
    await cpRf(file, enFile);
  }
  await writeFile(outputFile, content);
  consola.success(`保存しました`);
}

main().catch((error) => {
  consola.error(error);
  process.exit(1);
});
