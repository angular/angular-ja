#!/bin/bash -eux

echo "Checking aio changes in origin..."

aioHash="b62a9d0"

git -C origin fetch --all
git -C origin reset ${aioHash} --hard

node scripts/sync-origin.js

echo "Finished!"
