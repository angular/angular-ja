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
  consola.start('Start watching adev-ja files...');
  const fileWatcher = watchLocalizedFiles();

  consola.start('Start adev server...');
  const adevServer = await serveAdev();

  const shutdown = () => {
    consola.info('Shutting down...');
    fileWatcher.cancel();
    adevServer.cancel();
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((error) => {
  consola.error(error);
  process.exit(1);
});
