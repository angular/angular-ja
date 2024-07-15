import chalk from 'chalk';
import { parseArgs } from 'node:util';
import { buildAdev } from './lib/adev';
import { modifyBuildOutput } from './lib/localize';
import setup from './lib/setup';

async function main() {
  const args = parseArgs({
    options: {
      // flag to skip initialization.
      'no-init': { type: 'boolean', default: false },
    },
  });

  console.log({ ...args.values });
  const { 'no-init': noInit } = args.values;
  const init = !noInit;

  console.log(chalk.green('==== setup ===='));
  if (init) {
    await setup();
  } else {
    console.log(chalk.gray('Skip initialization.'));
  }

  console.log(chalk.green('==== build ===='));
  await build();
}

async function build() {
  await buildAdev();
  await modifyBuildOutput();
}

main().catch((error) => {
  console.error(chalk.red(error));
  process.exit(1);
});
