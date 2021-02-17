#!/bin/bash -eux

echo "Checking aio changes in origin..."

aioHash="53865c4517" # v11.2.1

git -C origin fetch --all
git -C origin reset ${aioHash} --hard

node scripts/sync-origin.js

echo "Finished!"
