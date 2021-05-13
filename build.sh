#!/bin/bash -eux

BUILD_DIR=build-out

# copy origin to temporary workspace
cd origin
git clean -xdn
cd ..
rsync -a --delete origin/ ${BUILD_DIR}/

# overrides files from ja directory
rsync -a --exclude='**/*.en.*' --exclude='**/*.old' aio-ja/ ${BUILD_DIR}/aio

cd ${BUILD_DIR}

# apply git patches
git apply -p1 ../scripts/git-patch/*.patch

# build angular.io
cd aio
yarn build

cd ../../

# Copy robots.txt
cp -rf aio-ja/src/robots.txt ${BUILD_DIR}/aio/dist/

# Modify sitemap
sed -i -e "s/angular.io/angular.jp/g" ${BUILD_DIR}/aio/dist/generated/sitemap.xml
