import { consola } from 'consola';
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

  consola.debug({ ...args.values });
  const { init = false } = args.values;

  consola.start('==== setup ====');
  if (init) {
    consola.info('build ディレクトリを初期化し、キャッシュを破棄します。');
    await setup();
  } else {
    consola.ready('Skip initialization.');
    consola.info(
      'build ディレクトリを初期化するには --init オプションを指定してください。'
    );
  }

  consola.start('==== watch ====');
  await watch();
}

async function watch() {
  let adevProcess = serveAdev();
  consola.start('Start watching adev-ja files...');

  const watcher = watchLocalizedFiles(
    async () => {
      if (adevProcess != null) {
        await adevProcess.cancel();
      }
      consola.start('Restarting adev...');
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
  consola.error(error);
  process.exit(1);
});
