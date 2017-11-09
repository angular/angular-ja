#!/bin/bash -eux

# copy origin to temporary workspace
cd origin
git clean -xdn
cd ..
rsync -ar --delete origin/ .tmp/ 

# overrides files from ja directory
rsync -ar aio-ja/ .tmp/aio

# build angular.io
cd .tmp/aio
yarn build
cd ../../