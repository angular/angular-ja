#!/bin/bash -eux

# copy origin to temporary workspace
cd origin
git clean -xdn
cd ..
rsync -ar --delete origin/ .tmp/ 

# overrides files from ja directory
rsync -ar aio-ja/ .tmp/aio

# build angular.io
cd .tmp
yarn install --frozen-lockfile --non-interactive
cd aio
yarn build

cd ../../

# Copy robots.txt
cp -rf aio-ja/src/robots.txt .tmp/aio/dist/

# Modify sitemap
sed -i -e "s/angular.io/angular.jp/g" .tmp/aio/dist/generated/sitemap.xml

if [ "${NETLIFY:-unknown}" != unknown ]; then
  # Netlifyの `pip cache` の永続化時間を緩和するため、 `~/.cache` に保存されているyarnのキャッシュを削除する
  # See also: https://github.com/netlify/build-image/blob/xenial/run-build-functions.sh#L633
  yarn cache clean
fi