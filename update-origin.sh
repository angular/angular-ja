#!/bin/bash -eux

echo "Checking aio changes in origin..."

aioHash="7fe95b188"

git -C origin fetch --all
git -C origin reset ${aioHash} --hard

node scripts/sync-origin.js

echo "Finished!"
