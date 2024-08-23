import { watch } from 'chokidar';
import { consola } from 'consola';
import { $ } from 'execa';
import { globby as glob } from 'globby';
import { resolve } from 'node:path';
import { debounceTime, from, mergeMap, Observable } from 'rxjs';
import { cpRf, replaceAllInFile } from './fsutils';
import { generateSitemap } from './sitemap';
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

export function watchLocalizedFiles() {
  return new Observable<string>((subscriber) => {
    const watcher = watch(localizedFilePatterns, {
      cwd: adevJaDir,
      awaitWriteFinish: true,
    });
    watcher.on('change', (file) => {
      consola.info(`File changed: ${file}`);
      subscriber.next(file);
    });

    return async () => {
      await watcher.close();
    };
  }).pipe(
    // 変更があったファイルをビルドディレクトリにコピーする
    mergeMap((file) => from(copyLocalizedFile(file))),
    // 1秒間の変更をまとめる
    debounceTime(1000)
  );
}

/**
 * Modify adev build artifacts after build.
 */
export async function modifyBuildOutput() {
  await $`chmod -R +w ${buildOutputDir}`;

  consola.start('Copy static files...');
  await copyStaticFiles();
  consola.start('Replace GitHub edit links...');
  await replaceAdevGitHubEditLinks();
  await generateSitemap(resolve(buildOutputDir, 'sitemap.xml'));
}

/**
 * Copy static files into build output directory
 */
async function copyStaticFiles() {
  const files: string[] = [];
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
