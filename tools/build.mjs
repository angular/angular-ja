#!/usr/bin/env zx

import { chalk, argv } from 'zx';
import {
  applyPatches,
  buildAdev,
  copyLocalizedFiles,
  remove404HTML,
  copyRobots,
  modifySitemap,
  resetBuildDir,
} from './lib/common.mjs';

// `init` is true by default, use `--no-init` flag to skip initialization.
const { init = true } = argv;

try {
  console.log(chalk.green('==== setup ===='));
  await setup(init);
  console.log(chalk.green('==== preBuild ===='));
  await preBuild();
  console.log(chalk.green('==== build ===='));
  await build();
  console.log(chalk.green('==== postBuild ===='));
  await postBuild();
} catch (e) {
  console.error(chalk.red(e));
  process.exit(1);
}

async function setup(init) {
  await resetBuildDir({ init });
}

async function preBuild() {
  // copy translated files
  // console.log(chalk.cyan('Copy localized files...'));
  // await copyLocalizedFiles();

  // apply patches
  console.log(chalk.cyan('Apply patches...'));
  await applyPatches();
}

async function build() {
  await buildAdev();
}

async function postBuild() {
  // await copyRobots();
  // await remove404HTML();
  // await modifySitemap();
}
