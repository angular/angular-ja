import { consola } from 'consola';
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

  consola.start('==== setup ====');
  if (init) {
    await setup();
  } else {
    consola.ready('Skip initialization.');
  }

  consola.start('==== build ====');
  await build();
}

async function build() {
  await buildAdev();
  await modifyBuildOutput();
}

main().catch((error) => {
  consola.error(error);
  process.exit(1);
});
