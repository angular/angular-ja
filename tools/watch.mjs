#!/usr/bin/env zx

import { argv, chalk } from 'zx';
import {
  applyPatches,
  resetBuildDir,
  serveAdev,
  watchLocalizedFiles,
} from './lib/common.mjs';

try {
  const { init = false } = argv;

  console.log(chalk.green('==== setup ===='));
  await setup({ init });
  console.log(chalk.green('==== preWatch ===='));
  await preWatch({ init });
  console.log(chalk.green('==== watch ===='));
  await watch();
} catch (e) {
  console.error(chalk.red(e));
  process.exit(1);
}

async function setup({ init }) {
  console.log('');
  console.log(chalk.white('変更監視の対象は、adev-ja 内のファイルです'));
  if (init) {
    console.log(
      chalk.yellow('build ディレクトリを初期化し、キャッシュを破棄します。')
    );
  } else {
    console.log(
      chalk.white(
        'build ディレクトリを初期化するには --init オプションを指定してください。'
      )
    );
  }
  console.log('');
  await resetBuildDir({ init });
}

async function preWatch({ init }) {
  if (init) {
    console.log(chalk.cyan('Copy localized files...'));
    await copyLocalizedFiles();

    console.log(chalk.cyan('Apply patches...'));
    await applyPatches();
  }
}

async function watch() {
  let adevProcess = serveAdev();
  console.log(chalk.cyan('Start watching adev-ja files...'));
  watchLocalizedFiles(async () => {
    if (adevProcess != null) {
      await adevProcess.cancel();
    }
    console.log(chalk.cyan('Restarting adev...'));
    adevProcess = serveAdev();
  });
}
