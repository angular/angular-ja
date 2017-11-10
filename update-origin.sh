#!/bin/bash -eu

cd origin

echo "Checking aio changes in origin..."

git fetch
localRev=$(git rev-parse master)
remoteRev=$(git rev-parse origin/master)

aioDiff=$(git diff master origin/master --name-only)

if [ -n "${aioDiff}" ]; then
    # Diffs exist
    echo "Some changes are in aio."
    echo -e "\n${aioDiff}\n"
    echo "Please check diffs and sync to origin manually."
    echo -e "\n\tgit diff master origin/master --relative aio"
    open "https://github.com/angular/angular/compare/${localRev}...${remoteRev}"
    exit 0
else
    # no diff = automatic sync
    echo "No changes are in aio. Syncing origin automatically..."
    git pull origin master
fi

echo "Finished!"

cd ../