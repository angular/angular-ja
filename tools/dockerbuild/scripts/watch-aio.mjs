#!/usr/bin/env zx

import { watch } from 'chokidar';

const contentsWatcher = watch('/aio-ja', {
    ignored: ['**/*.en.md', '**/*.old'],
    cwd: '/aio-ja',
    persistent: true
});

async function copyFile(path) {
    cd('/');
    await $`cp aio-ja/${path} origin/aio/${path}`;
}

contentsWatcher.on('change', (path) => {
    console.log(`[watch] "${path}" has been changed.`);
    copyFile(path);
});

cd('/origin/aio');
try {
    await $`yarn serve-and-sync --host=0.0.0.0 --disableHostCheck`;
} finally {
    contentsWatcher.close();
}
