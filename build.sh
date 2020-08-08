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
