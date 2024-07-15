import chalk from 'chalk';
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
  const args = parseArgs({});
  const [originHash] = args.positionals;

  if (originHash == null) {
    console.log(chalk.cyan('No origin SHA is provided.'));
    console.log(chalk.cyan('Use the current origin HEAD.'));
  } else {
    console.log(chalk.green('origin SHA: ' + originHash));
    console.log(chalk.cyan('Reset origin...'));
    await resetOrigin(originHash);
  }

  console.log(chalk.cyan('Copy origin files to adev-ja...'));
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
  console.error(chalk.red(error));
  process.exit(1);
});
