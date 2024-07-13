import { watch } from 'chokidar';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { $, cd, chalk, glob, os, within } from 'zx';
import { cpRf, exists, initDir, rename, sed } from './fileutils.mjs';

const rootDir = resolve(__dirname, '../');
const aiojaDir = resolve(rootDir, 'aio-ja');
const outDir = resolve(rootDir, 'build');

export async function resetBuildDir({ init = false }) {
  if (init) {
    console.log(chalk.cyan('synchronizing git submodule...'));
    await syncSubmodule();
  }

  const buildDirExists = await exists(outDir);
  if (init || !buildDirExists) {
    console.log(chalk.cyan('removing build directory...'));
    await initDir(outDir);
    console.log(chalk.cyan('copying origin files to build directory...'));
    await cpRf(resolve(rootDir, 'origin'), outDir);
  }
}

export async function setupBazelrc() {
  await within(async () => {
    const cachePath = process.env.BAZEL_REPO_CACHE_PATH || resolve(os.homedir(), '.cache/bazel_repo_cache');
    const escapedCachePath = cachePath.replace(/\\/g, '\\\\');

    cd(`${outDir}`);
    const bazelrcContent = `
  # Print all the options that apply to the build.
  # This helps us diagnose which options override others
  # (e.g. /etc/bazel.bazelrc vs. tools/bazel.rc)
  build --announce_rc

  # Avoids re-downloading NodeJS/browsers all the time.
  build --repository_cache=${escapedCachePath}

  # More details on failures
  build --verbose_failures=true

  # CI supports colors but Bazel does not detect it.
  common --color=yes
`;
    await writeFile('.bazelrc.user', bazelrcContent);
  });
}

export async function buildAdev() {
  await within(async () => {
    cd(`${outDir}`);
    await $`yarn install --frozen-lockfile`;
    await $`yarn bazel build //adev:build`;
  });
}

export async function watchAIO() {
  await within(async () => {
    cd(`${outDir}`);
    await $`yarn docs`;
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
    const patches = await glob('tools/adev-patches/*.patch', { cwd: rootDir });
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

// copy _redirects
export async function remove404HTML() {
  await $`chmod -R +w ${resolve(outDir, 'dist/bin/aio/build')}`;
  const from = resolve(outDir, 'dist/bin/aio/build/404.html');
  const to = resolve(outDir, 'dist/bin/aio/build/_404.html');
  await rename(from, to);
}
