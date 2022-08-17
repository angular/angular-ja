#!/usr/bin/env zx

import { watch } from 'chokidar';
import { copyFile } from 'node:fs';

const contentsWatcher = watch('/aio-ja', {
    ignored: ['**/*.en.md', '**/*.old'],
    cwd: '/aio-ja',
    persistent: true
});

contentsWatcher.on('change', (path) => {
    console.log(`[watch] "${path}" has been changed.`);
    copyFile(`/aio-ja/${path}`, `/origin/aio/${path}`, err => {
      if (err) console.error(err.message, `(${path})`);
    });
});

cd('/origin/aio');
try {
    await $`export npm_execpath=$(yarn config get yarn-path); yarn serve-and-sync --host=0.0.0.0 --disable-host-check`;
} finally {
    contentsWatcher.close();
}
