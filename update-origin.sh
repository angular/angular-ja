#!/bin/bash -eux

echo "Checking aio changes in origin..."

ngVersion="6.1.x"

git -C origin fetch origin ${ngVersion}
git -C origin reset FETCH_HEAD --hard

node scripts/sync-origin.js

echo "Finished!"
