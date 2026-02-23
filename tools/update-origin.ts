import { consola } from 'consola';
import { $ } from 'execa';
import { globby as glob } from 'globby';
import { extname, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { cpRf, exists } from './lib/fsutils';
import { adevJaDir, rootDir } from './lib/workspace';

const localizedFilePatterns: Array<string | readonly string[]> = [
  // Text contents
  [
    'src/content/**/*.md',
    '!src/content/**/license.md',
    '!src/content/kitchen-sink.md',
    '!src/content/examples/**/readme.md',
    '!src/content/tutorials/README.md',
    '!src/content/reference/concepts/overview.md',
  ],
  // Tutorial config files
  'src/content/tutorials/**/config.json',
  // Update home files
  'src/app/features/home/home.component.html',
  'src/app/features/home/components/signals-demo/signals-demo.html',
  'src/app/features/home/components/control-flow/control-flow-example.html',
  'src/app/features/home/components/deferrable-views-example/deferrable-views-example.html',
  'src/app/features/home/components/hydration-example/hydration-example.html',
  // Update guide files
  'src/app/features/update/recommendations.ts',
  'src/app/features/update/update.component.ts',
  'src/app/features/update/update.component.html',
  // Application files
  'src/index.html',
  'src/app/core/services/a-dev-title-strategy.ts',
  'src/app/routing/sub-navigation-data.ts',
  'src/app/routing/navigation-entries/index.ts',
  'shared-docs/components/table-of-contents/table-of-contents.component.html',
  'shared-docs/components/cookie-popup/cookie-popup.component.html',
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

  // adev-ja 内に同名ファイルの .en.xxx がある場合はそちらを上書きする
  // .en.xxx がない場合はそのままコピーする
  for (const pattern of localizedFilePatterns) {
    const files = await glob(pattern, {
      cwd: adevDir,
      caseSensitiveMatch: true,
    });
    // 否定パターンではなくパターンに合致するファイルがまったくない場合はエラーとする。
    if (files.length === 0) {
      throw new Error(`No files matched: ${JSON.stringify(pattern)}`);
    }
    for (const file of files) {
      const src = resolve(adevDir, file);
      const ext = extname(file);
      const enFilePath = file.replace(`${ext}`, `.en${ext}`);
      const isTranslated = await exists(resolve(adevJaDir, enFilePath));
      const dest = resolve(adevJaDir, isTranslated ? enFilePath : file);
      await cpRf(src, dest);
    }
  }
}

main().catch((error) => {
  consola.error(error);
  process.exit(1);
});
