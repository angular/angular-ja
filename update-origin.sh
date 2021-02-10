#!/bin/bash -eux

echo "Checking aio changes in origin..."

aioHash="9517ae3f23" # v11.1.3

git -C origin fetch --all
git -C origin reset ${aioHash} --hard

node scripts/sync-origin.js

echo "Finished!"
