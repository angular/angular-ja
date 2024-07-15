import chalk from 'chalk';
import { $ } from 'execa';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { cpRf, exists, rmrf } from './fsutils';
import { applyPatches, copyLocalizedFiles } from './localize';
import { buildDir, rootDir } from './workspace';

export default async function () {
  console.log(chalk.cyan('Synchronize git submodule...'));
  await syncSubmodule();

  console.log(chalk.cyan('Initialize build directory...'));
  await initBuildDir();

  console.log(chalk.cyan('Copy localized files...'));
  await copyLocalizedFiles();

  console.log(chalk.cyan('Apply patches...'));
  await applyPatches();
}

async function syncSubmodule() {
  const sh = $({ cwd: rootDir, verbose: 'short' });
  await sh`git submodule sync`;
  await sh`git submodule update --init`;
}

async function initBuildDir() {
  await rmrf(buildDir);
  await mkdir(buildDir, { recursive: true });
  await cpRf(resolve(rootDir, 'origin'), buildDir);
  await cpRf(resolve(rootDir, '.bazelrc'), resolve(buildDir, '.bazelrc.user'));
}
