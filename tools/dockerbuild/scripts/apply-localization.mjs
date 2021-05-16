#!/usr/bin/env zx

cd('/');
await $`rsync -a --exclude='**/*.en.*' --exclude='**/*.old' aio-ja/ origin/aio`;
cd('/origin');
await $`git apply -p1 /scripts/git-patch/*.patch`;

