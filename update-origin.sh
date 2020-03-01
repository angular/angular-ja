#!/bin/bash -eux

echo "Checking aio changes in origin..."

aioHash="89f6b341a3"

git -C origin fetch --all
git -C origin reset ${aioHash} --hard

node scripts/sync-origin.js

echo "Finished!"
