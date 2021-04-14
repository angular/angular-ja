#!/bin/bash -eux

echo "Checking aio changes in origin..."

aioHash="$1"

if [ -z "${aioHash}" ]; then
    echo "No aio origin SHA is provided.";
    exit 1;
fi


git -C origin fetch --all
git -C origin reset ${aioHash} --hard

node scripts/sync-origin.js

echo "Finished!"
