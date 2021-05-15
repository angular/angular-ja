#!/usr/bin/env zx

async function applyLocalization() {
    cd('/');
    await $`rsync -a --exclude='**/*.en.*' --exclude='**/*.old' aio-ja/ origin/aio`;
    cd('/origin');
    await $`git apply -p1 /scripts/git-patch/*.patch`;
}

async function buildAIO() { 
    cd('/origin/aio');
    await $`yarn build`;
    await $`cp -f ../../aio-ja/src/robots.txt ./dist/`;
    await $`sed -i -e "s/angular.io/angular.jp/g" ./dist/generated/sitemap.xml`;
}

await applyLocalization();
await buildAIO();