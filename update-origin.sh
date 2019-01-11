#!/bin/bash -eux

echo "Checking aio changes in origin..."

ngVersion="7.2.x"
aioHash="7227b4a"

git -C origin fetch origin ${ngVersion}
git -C origin reset ${aioHash} --hard

node scripts/sync-origin.js

echo "Finished!"
