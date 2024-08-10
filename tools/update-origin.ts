import { consola } from 'consola';
import { $ } from 'execa';
import { globby as glob } from 'globby';
import { extname, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { cpRf, exists } from './lib/fsutils';
import { adevJaDir, rootDir } from './lib/workspace';

const localizedFilePatterns = [
  // Text contents
  'src/content/**/*.md',
  '!src/content/**/license.md',
  // Tutorial config files
  'src/content/tutorials/**/config.json',
  // Application files
  'src/app/sub-navigation-data.ts',
  'shared-docs/components/table-of-contents/table-of-contents.component.html',
];

async function main() {
  const args = parseArgs({ allowPositionals: true });
  const [originHash] = args.positionals;

  if (originHash == null) {
    consola.info(
      'origin SHAが指定されていません。現在の origin のHEADを参照します。'
    );
  } else {
    consola.ready('origin SHA: ' + originHash);
    consola.start('Reset origin...');
    await resetOrigin(originHash);
  }

  consola.start('Copy origin files to adev-ja...');
  await copyOriginFiles();
}

async function resetOrigin(hash: string) {
  await $`git -C origin fetch --all`;
  await $`git -C origin reset ${hash} --hard`;
}

async function copyOriginFiles() {
  const adevDir = resolve(rootDir, 'origin/adev');
  const adevFiles = await glob(localizedFilePatterns, {
    cwd: adevDir,
    caseSensitiveMatch: true,
  });

  // adev-ja 内に同名ファイルの .en.xxx がある場合はそちらを上書きする
  // .en.xxx がない場合はそのままコピーする
  for (const file of adevFiles) {
    const src = resolve(adevDir, file);
    const ext = extname(file);
    const enFilePath = file.replace(`${ext}`, `.en${ext}`);
    const isTranslated = await exists(resolve(adevJaDir, enFilePath));
    const dest = resolve(adevJaDir, isTranslated ? enFilePath : file);
    await cpRf(src, dest);
  }
}

main().catch((error) => {
  consola.error(error);
  process.exit(1);
});
