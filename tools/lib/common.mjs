import { watch } from 'chokidar';
import { resolve, basename } from 'node:path';
import { execa } from 'execa';
// TODO: replace $ to execa
import { $, cd, chalk, glob, within } from 'zx';
import kill from 'tree-kill';
import { cpRf, exists, initDir, rename, sed } from './fileutils.mjs';

const $$ = execa({
  stdin: 'inherit',
  stdout: 'inherit',
  stderr: 'inherit',
  preferLocal: true,
  verbose: 'short',
});

const rootDir = resolve(__dirname, '../');
const adevJaDir = resolve(rootDir, 'adev-ja');
const aiojaDir = resolve(rootDir, 'aio-ja');
const buildDir = resolve(rootDir, 'build');
const buildOutputDir = resolve(buildDir, 'dist/bin/adev/build/browser');

export async function resetBuildDir({ init = false }) {
  if (init) {
    console.log(chalk.cyan('synchronizing git submodule...'));
    await syncSubmodule();
  }

  const buildDirExists = await exists(buildDir);
  if (init || !buildDirExists) {
    console.log(chalk.cyan('removing build directory...'));
    await initDir(buildDir);
    console.log(chalk.cyan('copying origin files to build directory...'));
    await cpRf(resolve(rootDir, 'origin'), buildDir);
    console.log(chalk.cyan('copying .bazelrc to build directory...'));
    await cpRf(
      resolve(rootDir, '.bazelrc'),
      resolve(buildDir, '.bazelrc.user')
    );
  }
}

export async function buildAdev() {
  await $$({ cwd: buildDir })`yarn install --frozen-lockfile`;
  await $$({ cwd: buildDir })`yarn bazel build //adev:build`;
}

export function serveAdev() {
  const p = $$({
    cwd: buildDir,
    reject: false,
  })`npx bazel run //adev:serve --fast_adev`;
  console.debug(chalk.gray('adev process started.', p.pid));
  const abort = () => kill(p.pid);
  p.finally(() => {
    console.debug(chalk.gray('adev process exited.', p.pid));
  });
  return {
    cancel: async () => {
      abort();
      return await p;
    },
  };
}

/**
 * 翻訳用ファイルのパターン
 * このパターンに一致するファイルがビルドディレクトリにコピーされます。
 */
const localizedFilePatterns = ['**/*', '!**/*.en.*', '!**/*.old'];

/**
 * 翻訳用ファイルをビルドディレクトリにコピーします。
 *
 * @param {string} file
 */
async function copyLocalizedFile(file) {
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

/**
 * @param {() => () => void} onChangeCallback
 */
export function watchLocalizedFiles(onChangeCallback) {
  const watcher = watch(localizedFilePatterns, {
    cwd: adevJaDir,
    awaitWriteFinish: true,
  });
  watcher.on('change', async (file) => {
    console.debug(chalk.gray(`File changed: ${file}`));
    await copyLocalizedFile(file);
    onChangeCallback();
  });
  return {
    cancel: () => {
      watcher.close();
    },
  };
}

export async function applyPatches() {
  await within(async () => {
    cd(buildDir);
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
  await $`chmod -R +w ${resolve(buildDir, 'dist/bin/aio/build')}`;
  const src = resolve(aiojaDir, 'src/robots.txt');
  const dest = resolve(buildDir, 'dist/bin/aio/build/robots.txt');
  await cpRf(src, dest);
}

// Copy static files into build output directory
export async function copyStaticFiles() {
  await $`chmod -R +w ${buildOutputDir}`;
  const files = ['_headers'];
  for (const file of files) {
    const src = resolve(adevJaDir, file);
    const dest = resolve(buildOutputDir, file);
    await cpRf(src, dest);
  }
}

// Replace all links to GitHub edit page for adev contents.
export async function replaceAdevGitHubEditLinks() {
  await $`chmod -R +w ${buildOutputDir}`;
  const contentFiles = await glob(['**/*.html'], { cwd: buildOutputDir });
  const from = 'https://github.com/angular/angular/edit/main/adev/';
  const to = 'https://github.com/angular/angular-ja/edit/main/adev-ja/';
  await Promise.all(
    contentFiles.map(async (file) => {
      const path = resolve(buildOutputDir, file);
      await sed(path, from, to);
    })
  );
}

// replace angular.io to angular.jp in sitemap.xml
export async function modifySitemap() {
  await $`chmod -R +w ${resolve(buildDir, 'dist/bin/aio/build')}`;
  const sitemapPath = resolve(
    buildDir,
    'dist/bin/aio/build/generated/sitemap.xml'
  );
  await sed(sitemapPath, 'angular.io', 'angular.jp');
}

// copy _redirects
export async function remove404HTML() {
  await $`chmod -R +w ${resolve(buildDir, 'dist/bin/aio/build')}`;
  const from = resolve(buildDir, 'dist/bin/aio/build/404.html');
  const to = resolve(buildDir, 'dist/bin/aio/build/_404.html');
  await rename(from, to);
}
