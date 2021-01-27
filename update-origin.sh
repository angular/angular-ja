#!/bin/bash -eux

echo "Checking aio changes in origin..."

aioHash="95e68c4f27" # v11.1.1

git -C origin fetch --all
git -C origin reset ${aioHash} --hard

node scripts/sync-origin.js

echo "Finished!"
