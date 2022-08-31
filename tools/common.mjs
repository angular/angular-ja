import { watch } from 'chokidar';
import { resolve } from 'node:path';
import { $, cd, glob, within } from 'zx';
import { clearDir, cpRf, sed } from './fileutils.mjs';

const rootDir = resolve(__dirname, '../');
const aiojaDir = resolve(rootDir, 'aio-ja');
const outDir = resolve(rootDir, 'build');

export async function resetBuildDir() {
  await clearDir(outDir);
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
  const patches = await glob('scripts/git-patch/*.patch', { cwd: rootDir });
  await within(async () => {
    cd(outDir);
    for (const patch of patches) {
      await $`git apply -p1 ${resolve(rootDir, patch)}`;
    }
  });
}

// copy robots.txt
export async function copyRobots() {
  const src = resolve(aiojaDir, 'src/robots.txt');
  const dest = resolve(outDir, 'aio/dist/robots.txt');
  await cpRf(src, dest);
}

// replace angular.io to angular.jp in sitemap.xml
export async function modifySitemap() {
  const sitemapPath = resolve(outDir, 'aio/dist/generated/sitemap.xml');
  await sed(sitemapPath, 'angular.io', 'angular.jp');
}
