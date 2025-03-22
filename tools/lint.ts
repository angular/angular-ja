import { consola } from 'consola';
import { $ } from 'execa';
import { extname } from 'node:path';
import { parseArgs } from 'node:util';
import { glob } from './lib/fsutils';
import { rootDir } from './lib/workspace';

/**
 * adev-ja ディレクトリ内にある Markdown ファイルのうち、
 * すでに翻訳済みのファイルだけを対象に textlint を実行する。
 */
async function main() {
  const args = parseArgs({
    options: { fix: { type: 'boolean', default: false } },
  });
  const { fix } = args.values;

  const $$ = $({
    cwd: rootDir,
    stdin: 'inherit',
    stdout: 'pipe',
    reject: false,
  });
  process.env.FORCE_COLOR = '1';

  const files = await getTranslatedFiles();
  const { stdout, failed } = await $$`textlint ${fix ? ['--fix'] : []} ${files}`;
  consola.log(stdout.replace('textlint --fix [file]', 'yarn lint --fix'));

  if (failed) {
    process.exit(1);
  }
}

/**
 * 対応する `.en.*` ファイルが存在する（=翻訳済みである）Markdownファイルのリストを取得する。
 */
async function getTranslatedFiles() {
  const files = await glob('adev-ja/**/*.en.md', {
    cwd: rootDir,
    caseSensitiveMatch: true,
  });
  const translatedFiles = files.map((file) => {
    const ext = extname(file);
    return file.replace(`.en${ext}`, ext);
  });
  return translatedFiles;
}

main().catch((error) => {
  consola.error(error);
  process.exit(1);
});
