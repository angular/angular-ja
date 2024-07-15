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
  // Application files
  'src/app/sub-navigation-data.ts',
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

  for (const file of adevFiles) {
    const src = resolve(adevDir, file);
    // adev-ja 内に .en が付いているファイルがあればそちらに上書きする
    const ext = extname(file);
    const enFilePath = file.replace(`${ext}`, `.en${ext}`);
    let isTranslated = await exists(resolve(adevJaDir, enFilePath));
    const dest = resolve(adevJaDir, isTranslated ? enFilePath : file);
    await cpRf(src, dest);
  }
}

main().catch((error) => {
  consola.error(error);
  process.exit(1);
});
