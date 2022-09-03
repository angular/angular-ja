#!/usr/bin/env zx

import { argv, chalk } from 'zx';
import { applyPatches, copyLocalizedFiles, resetBuildDir, watchAIO, watchLocalizedFiles } from './lib/common.mjs';

try {
  const { 'clear-cache': clearCache = false } = argv;

  console.log(chalk.green('==== setup ===='));
  await setup({ clearCache });
  console.log(chalk.green('==== preWatch ===='));
  await preWatch();
  console.log(chalk.green('==== watch ===='));
  await watch();
} catch (e) {
  console.error(chalk.red(e));
  process.exit(1);
}

async function setup({ clearCache }) {
  console.log('');
  console.log(chalk.yellow('変更監視の対象は、aio-ja 内のファイル と build/aio 内のソースコードです。'));
  if (clearCache) {
    console.log(chalk.yellow('build ディレクトリを初期化し、キャッシュを破棄します。'));
  } else {
    console.log(chalk.yellow('build ディレクトリを初期化するには --clear-cache オプションを指定してください。'));
  }
  console.log('');
  await resetBuildDir({ removeExisting: clearCache });
}

async function preWatch() {
  // copy translated files
  console.log(chalk.cyan('Copy localized files...'));
  await copyLocalizedFiles();

  // apply patches
  console.log(chalk.cyan('Apply patches...'));
  await applyPatches();
}

async function watch() {
  const ctrl = new AbortController();
  await watchLocalizedFiles(ctrl.signal);
  try {
    await watchAIO();
  } finally {
    console.log(chalk.cyan('Abort watching...'));
    ctrl.abort();
  }
}
