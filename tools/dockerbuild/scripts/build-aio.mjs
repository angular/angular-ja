#!/usr/bin/env zx

await import('./apply-localization.mjs');
cd('/origin/aio');
await $`yarn build`;
await $`cp -f ../../aio-ja/src/robots.txt ./dist/`;
await $`sed -i -e "s/angular.io/angular.jp/g" ./dist/generated/sitemap.xml`;
