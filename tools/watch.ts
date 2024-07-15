import chalk from 'chalk';
import { parseArgs } from 'node:util';
import { serveAdev } from './lib/adev';
import { watchLocalizedFiles } from './lib/localize';
import setup from './lib/setup';

async function main() {
  const args = parseArgs({
    options: {
      // flag to run initialization.
      init: { type: 'boolean' },
    },
  });

  console.log({ ...args.values });
  const { init = false } = args.values;

  console.log(chalk.green('==== setup ===='));
  if (init) {
    console.log(
      chalk.yellow('build ディレクトリを初期化し、キャッシュを破棄します。')
    );
    await setup();
  } else {
    console.log(chalk.grey('Skip initialization.'));
    console.log(
      chalk.white(
        'build ディレクトリを初期化するには --init オプションを指定してください。'
      )
    );
  }

  console.log(chalk.green('==== watch ===='));
  await watch();
}

async function watch() {
  let adevProcess = serveAdev();
  console.log(chalk.cyan('Start watching adev-ja files...'));

  const watcher = watchLocalizedFiles(
    async () => {
      if (adevProcess != null) {
        await adevProcess.cancel();
      }
      console.log(chalk.cyan('Restarting adev...'));
      adevProcess = serveAdev();
    },
    async () => {
      if (adevProcess != null) {
        await adevProcess.cancel();
      }
    }
  );

  process.on('SIGINT', watcher.cancel);
  process.on('SIGTERM', watcher.cancel);
}

main().catch((error) => {
  console.error(chalk.red(error));
  process.exit(1);
});
