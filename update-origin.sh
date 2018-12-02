#!/bin/bash -eux

echo "Checking aio changes in origin..."

ngVersion="7.1.x"

git -C origin fetch origin ${ngVersion}
git -C origin reset 5acfdee --hard

node scripts/sync-origin.js

echo "Finished!"
