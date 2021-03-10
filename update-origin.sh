#!/bin/bash -eux

echo "Checking aio changes in origin..."

aioHash="01c1677151" # v11.2.5

git -C origin fetch --all
git -C origin reset ${aioHash} --hard

node scripts/sync-origin.js

echo "Finished!"
