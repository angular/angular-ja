#!/bin/bash -eu

echo "Checking aio changes in origin..."

git -C origin fetch
localRev=$(git -C origin rev-parse master)
remoteRev=$(git -C origin rev-parse origin/master)

aioDiff=$(git -C origin diff master origin/master --name-only --relative aio)

if [ -n "${aioDiff}" ]; then
    # Diffs exist
    echo "Some changes are in aio."
    echo -e "\n${aioDiff}\n"
    echo "Please check diffs and sync to origin manually."
    echo -e "\n\tgit -C origin diff master origin/master --relative aio"
    open "https://github.com/angular/angular/compare/${localRev}...${remoteRev}"
    exit 0
else
    # no diff = automatic sync
    echo "No changes are in aio. Syncing origin automatically..."
    git -C origin pull origin master
fi

echo "Finished!"
