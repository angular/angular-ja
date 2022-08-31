#!/usr/bin/env zx

import { chalk } from 'zx';
import { applyPatches, copyLocalizedFiles, resetBuildDir, watchAIO, watchLocalizedFiles } from './common.mjs';

try {
  console.log(chalk.green('==== setup ===='));
  await setup();
  console.log(chalk.green('==== preWatch ===='));
  await preWatch();
  console.log(chalk.green('==== watch ===='));
  await watch();
} catch (e) {
  console.error(chalk.red(e));
  process.exit(1);
}

async function setup() {
  console.log('');
  console.log(chalk.yellow('変更監視の対象は、aio-ja 以下のファイル と build/aio 内のソースコードです。'));
  console.log('');
  await resetBuildDir();
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
  const closeLocalizedFilesWatcher = await watchLocalizedFiles();
  try {
    await watchAIO();
  } finally {
    closeLocalizedFilesWatcher();
  }
}
