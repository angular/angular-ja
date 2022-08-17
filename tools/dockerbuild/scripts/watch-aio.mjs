#!/usr/bin/env zx

import { copyFileSync } from 'node:fs';
import { watch } from 'chokidar';

const contentsWatcher = watch('/aio-ja', {
    ignored: ['**/*.en.md', '**/*.old'],
    cwd: '/aio-ja',
    persistent: true
});

async function copyFile(path) {
    cd('/');
    copyFileSync(`aio-ja/${path}`, `origin/aio/${path}`)
}

contentsWatcher.on('change', (path) => {
    console.log(`[watch] "${path}" has been changed.`);
    copyFile(path);
});

cd('/origin/aio');
try {
    await $`export npm_execpath=$(yarn config get yarn-path); yarn serve-and-sync --host=0.0.0.0 --disable-host-check`;
} finally {
    contentsWatcher.close();
}
