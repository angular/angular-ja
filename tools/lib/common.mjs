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
});

const rootDir = resolve(__dirname, '../');
const adevJaDir = resolve(rootDir, 'adev-ja');
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
    console.log(chalk.cyan('copying .bazelrc to build directory...'));
    await cpRf(resolve(rootDir, '.bazelrc'), resolve(outDir, '.bazelrc.user'));
  }
}

export async function buildAdev() {
  await within(async () => {
    cd(`${outDir}`);
    await $`yarn install --frozen-lockfile`;
    await $`yarn bazel build //adev:build`;
  });
}

export function serveAdev() {
  const p = $$({
    cwd: outDir,
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
const localizedFilePatterns = ['**/*', '!**/*.old'];

/**
 * 翻訳用ファイルをビルドディレクトリにコピーします。
 *
 * ファイルの拡張子が `.ja.xxx` である場合は、`.ja.xxx` を `.xxx` に変換してコピーします。
 * 例: `foo.ja.md` は `foo.md` としてコピーされます。
 *
 * 変更されたファイルに対応する翻訳済みのファイルが同じディレクトリに存在する場合、コピーされません。
 * 例: `guide/foo.md` が変更されても、`guide/foo.ja.md` が存在している場合はコピーされません。
 *
 * @param {string} file
 * @returns {Promise<boolean>} ファイルがコピーされた場合は `true`、コピーされなかった場合は `false`
 */
async function copyLocalizedFile(file) {
  const src = resolve(adevJaDir, file);
  // ファイル名が `.ja.xxx` である場合は、`.ja` を削除してコピーする
  if (basename(file).match(/\.ja\.[^.]+$/)) {
    const dest = resolve(outDir, 'adev', file.replace(/\.ja\./, '.'));
    return cpRf(src, dest).then(() => true);
  }
  // ファイル名が `.xxx` であり、同じディレクトリに `.ja.xxx` が存在する場合はコピーしない
  const jaFile = resolve(adevJaDir, file.replace(/(\.[^.]+)$/, '.ja$1'));
  if (await exists(jaFile)) {
    return false;
  }
  // その他のファイルはそのままコピーする
  const dest = resolve(outDir, 'adev', file);
  return cpRf(src, dest).then(() => true);
}

export async function copyLocalizedFiles() {
  const jaFiles = await glob(localizedFilePatterns, {
    cwd: adevJaDir,
  });
  for (const file of jaFiles) {
    await copyLocalizedFile(file);
  }
}

/**
 * @param {() => () => void} onChangeCallback
 */
export function watchLocalizedFiles(onChangeCallback) {
  const watcher = watch(localizedFilePatterns, { cwd: adevJaDir });
  watcher.on('change', async (path) => {
    const changed = await copyLocalizedFile(path);
    if (changed) {
      console.debug(chalk.gray(`File changed: ${path}`));
      onChangeCallback();
    }
  });
  return {
    cancel: () => {
      watcher.close();
    },
  };
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

// Copy static files into build output directory
export async function copyStaticFiles() {
  await $`chmod -R +w ${resolve(outDir, 'dist/bin/adev/build/browser')}`;
  const files = ['_headers'];
  for (const file of files) {
    const src = resolve(adevJaDir, file);
    const dest = resolve(outDir, 'dist/bin/adev/build/browser', file);
    await cpRf(src, dest);
  }
}

// replace angular.io to angular.jp in sitemap.xml
export async function modifySitemap() {
  await $`chmod -R +w ${resolve(outDir, 'dist/bin/aio/build')}`;
  const sitemapPath = resolve(
    outDir,
    'dist/bin/aio/build/generated/sitemap.xml'
  );
  await sed(sitemapPath, 'angular.io', 'angular.jp');
}

// copy _redirects
export async function remove404HTML() {
  await $`chmod -R +w ${resolve(outDir, 'dist/bin/aio/build')}`;
  const from = resolve(outDir, 'dist/bin/aio/build/404.html');
  const to = resolve(outDir, 'dist/bin/aio/build/_404.html');
  await rename(from, to);
}
