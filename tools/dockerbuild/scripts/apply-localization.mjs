#!/usr/bin/env zx

cd('/');
await $`rsync -a aio-localized/ origin/aio`;
cd('/origin');
await $`git apply -p1 /scripts/git-patch/*.patch`;
