import consola from 'consola';
import assert from 'node:assert';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import {
  cpRf,
  exists,
  getEnFilePath,
  getLocalizedFilePath,
} from '../lib/fsutils';
import { rootDir } from '../lib/workspace';
import { GeminiTranslator } from './translate';

async function main() {
  const apiKey = process.env.GOOGLE_API_KEY;
  assert(apiKey, 'GOOGLE_API_KEY 環境変数が設定されていません。');

  const args = parseArgs({
    options: { write: { type: 'boolean', default: false, short: 'w' } },
    allowPositionals: true,
  });
  const { write } = args.values;
  const [file] = args.positionals;

  const fileExists = await exists(file);
  if (!fileExists) {
    throw new Error(`ファイルが見つかりません: ${file}`);
  }

  const content = await readFile(file, 'utf-8');
  const prh = await readFile(resolve(rootDir, 'prh.yml'), 'utf-8');
  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

  const translator = new GeminiTranslator(apiKey, model);
  const translated = await translator.translate(content, prh);

  console.log(translated);
  await writeTranslatedContent(file, translated, write);
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
