#!/bin/bash -eux

echo "Checking aio changes in origin..."

ngVersion="7.0.x"

git -C origin fetch origin ${ngVersion}
git -C origin reset dc05385 --hard

node scripts/sync-origin.js

echo "Finished!"
