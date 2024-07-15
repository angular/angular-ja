import chalk from 'chalk';
import { watch } from 'chokidar';
import { $ } from 'execa';
import { globby as glob } from 'globby';
import { resolve } from 'node:path';
import { cpRf, replaceAllInFile } from './fsutils';
import { adevJaDir, buildDir, buildOutputDir, rootDir } from './workspace';

export async function applyPatches() {
  const sh = $({ cwd: buildDir, verbose: 'short' });
  const patches = await glob('tools/adev-patches/*.patch', { cwd: rootDir });
  for (const patch of patches) {
    const path = resolve(rootDir, patch);
    await sh`git apply -p1 --ignore-whitespace ${path}`;
  }
}

/**
 * 翻訳用ファイルのパターン
 * このパターンに一致するファイルがビルドディレクトリにコピーされます。
 */
const localizedFilePatterns = ['**/*', '!**/*.en.*', '!**/*.old'];

/**
 * 翻訳用ファイルをビルドディレクトリにコピーします。
 */
async function copyLocalizedFile(file: string) {
  const src = resolve(adevJaDir, file);
  const dest = resolve(buildDir, 'adev', file);
  return cpRf(src, dest);
}

export async function copyLocalizedFiles() {
  const jaFiles = await glob(localizedFilePatterns, {
    cwd: adevJaDir,
  });
  await Promise.all(jaFiles.map(copyLocalizedFile));
}

export function watchLocalizedFiles(
  onChange: () => unknown,
  onCancel: () => unknown
) {
  const watcher = watch(localizedFilePatterns, {
    cwd: adevJaDir,
    awaitWriteFinish: true,
  });
  watcher.on('change', async (file) => {
    console.debug(chalk.gray(`File changed: ${file}`));
    await copyLocalizedFile(file);
    onChange();
  });
  return {
    cancel: async () => {
      watcher.close();
      await onCancel();
    },
  };
}

/**
 * Modify adev build artifacts after build.
 */
export async function modifyBuildOutput() {
  await $`chmod -R +w ${buildOutputDir}`;

  console.log(chalk.cyan('Copy static files...'));
  await copyStaticFiles();
  console.log(chalk.cyan('Replace GitHub edit links...'));
  await replaceAdevGitHubEditLinks();
  // await remove404HTML();
  // await modifySitemap();
}

/**
 * Copy static files into build output directory
 */
async function copyStaticFiles() {
  const files = ['_headers'];
  for (const file of files) {
    const src = resolve(adevJaDir, file);
    const dest = resolve(buildOutputDir, file);
    await cpRf(src, dest);
  }
}

/**
 * Replace all links to GitHub edit page for adev contents.
 */
async function replaceAdevGitHubEditLinks() {
  const contentFiles = await glob(['**/*.html'], { cwd: buildOutputDir });
  const from = 'https://github.com/angular/angular/edit/main/adev/';
  const to = 'https://github.com/angular/angular-ja/edit/main/adev-ja/';
  await Promise.all(
    contentFiles.map(async (file) => {
      const path = resolve(buildOutputDir, file);
      await replaceAllInFile(path, from, to);
    })
  );
}

// // copy robots.txt
// async function copyRobots() {
//   await $`chmod -R +w ${resolve(buildDir, 'dist/bin/aio/build')}`;
//   const src = resolve(aiojaDir, 'src/robots.txt');
//   const dest = resolve(buildDir, 'dist/bin/aio/build/robots.txt');
//   await cpRf(src, dest);
// }

// // replace angular.io to angular.jp in sitemap.xml
// async function modifySitemap() {
//   await $`chmod -R +w ${resolve(buildDir, 'dist/bin/aio/build')}`;
//   const sitemapPath = resolve(
//     buildDir,
//     'dist/bin/aio/build/generated/sitemap.xml'
//   );
//   await replaceAllInFile(sitemapPath, 'angular.io', 'angular.jp');
// }

// // copy _redirects
// async function remove404HTML() {
//   await $`chmod -R +w ${resolve(buildDir, 'dist/bin/aio/build')}`;
//   const from = resolve(buildDir, 'dist/bin/aio/build/404.html');
//   const to = resolve(buildDir, 'dist/bin/aio/build/_404.html');
//   await rename(from, to);
// }
