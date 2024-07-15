import { consola } from 'consola';
import { parseArgs } from 'node:util';
import { Observable, startWith, switchMap } from 'rxjs';
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

  const watcher = watchLocalizedFiles()
    .pipe(
      // 初回実行時に adev を起動する
      startWith(void 0),
      switchMap(
        () =>
          new Observable((subscriber) => {
            consola.start('Restarting adev...');
            const adevProcess = serveAdev();
            subscriber.next();

            return async () => {
              await adevProcess.cancel();
            };
          })
      )
    )
    .subscribe();

  process.on('SIGINT', watcher.unsubscribe);
  process.on('SIGTERM', watcher.unsubscribe);
}

main().catch((error) => {
  consola.error(error);
  process.exit(1);
});
