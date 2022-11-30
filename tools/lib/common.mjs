import { watch } from 'chokidar';
import { resolve } from 'node:path';
import { $, cd, chalk, glob, within } from 'zx';
import { initDir, cpRf, exists, sed } from './fileutils.mjs';

const rootDir = resolve(__dirname, '../');
const aiojaDir = resolve(rootDir, 'aio-ja');
const outDir = resolve(rootDir, 'build');

// default quote ($'...') is doesn't work on Windows.
// https://github.com/google/zx/blob/main/src/util.ts#L31
$.quote = (s) => s;

export async function resetBuildDir({ init = false }) {
  if (init) {
    console.log(chalk.cyan('synchronizing git submodule...'));
    await syncSubmodule();
  }

  const buildDirExists = await exists(outDir);
  if (init || !buildDirExists) {
    console.log(chalk.cyan('removing build directory...'));
    await initDir(outDir);
  }

  console.log(chalk.cyan('copying origin files to build directory...'));
  await cpRf(resolve(rootDir, 'origin'), outDir);
}

export async function buildAIO() {
  await within(async () => {
    cd(`${outDir}/aio`);
    await $`yarn build`;
  });
}

export async function watchAIO() {
  await within(async () => {
    cd(`${outDir}/aio`);
    await $`yarn setup`;
    await $`yarn serve-and-sync --open`;
  });
}

/**
 * glob patterns of localized files in aio-ja
 */
const lozalizedFilePatterns = ['**/*', '!**/*.en.*', '!**/*.old'];

export async function copyLocalizedFiles() {
  const jaFiles = await glob(lozalizedFilePatterns, {
    cwd: aiojaDir,
  });
  for (const file of jaFiles) {
    const src = resolve(aiojaDir, file);
    const dest = resolve(outDir, 'aio', file);
    await cpRf(src, dest);
  }
}

/**
 *
 * @param {AbortSignal} signal
 */
export async function watchLocalizedFiles(signal) {
  const watcher = watch(lozalizedFilePatterns, {
    cwd: aiojaDir,
  });
  watcher.on('change', (path) => {
    const src = resolve(aiojaDir, path);
    const dest = resolve(outDir, 'aio', path);
    cpRf(src, dest);
  });
  signal.addEventListener('abort', () => watcher.close());
}

export async function applyPatches() {
  await within(async () => {
    cd(outDir);
    const patches = await glob('tools/git-patch/*.patch', { cwd: rootDir });
    for (const patch of patches) {
      const path = resolve(rootDir, patch);
      await $`git apply -p1 --ignore-whitespace ${path}`;
    }
  });
}

export async function syncSubmodule() {
  await within(async () => {
    cd(rootDir);
    await $`git submodule sync`;
    await $`git submodule update --init`;
  });
}

// copy robots.txt
export async function copyRobots() {
  await $`chmod -R +w ${resolve(outDir, 'dist/bin/aio/build')}`;
  const src = resolve(aiojaDir, 'src/robots.txt');
  const dest = resolve(outDir, 'dist/bin/aio/build/robots.txt');
  await cpRf(src, dest);
}

// replace angular.io to angular.jp in sitemap.xml
export async function modifySitemap() {
  await $`chmod -R +w ${resolve(outDir, 'dist/bin/aio/build')}`;
  const sitemapPath = resolve(outDir, 'dist/bin/aio/build/generated/sitemap.xml');
  await sed(sitemapPath, 'angular.io', 'angular.jp');
}
