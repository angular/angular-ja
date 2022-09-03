#!/usr/bin/env zx

import { chalk } from 'zx';
import { applyPatches, buildAIO, copyRobots, copyLocalizedFiles, modifySitemap, resetBuildDir } from './lib/common.mjs';

try {
  console.log(chalk.green('==== setup ===='));
  await setup();
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

async function setup() {
  await resetBuildDir({ removeExisting: true });
}

async function preBuild() {
  // copy translated files
  console.log(chalk.cyan('Copy localized files...'));
  await copyLocalizedFiles();

  // apply patches
  console.log(chalk.cyan('Apply patches...'));
  await applyPatches();
}

async function build() {
  await buildAIO();
}

async function postBuild() {
  await copyRobots();
  await modifySitemap();
}
