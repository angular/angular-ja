#!/usr/bin/env zx

await import('./apply-localization.mjs');
cd('/origin/aio');
await $`yarn build`;
await $`cp -f ../../aio-localized/src/robots.txt ./dist/`;
await $`sed -i -e "s/angular.io/angulardocs.fr/g" ./dist/generated/sitemap.xml`;
