# Copy origin to temporary workspace.
Set-Location origin
git clean -xdn
Set-Location ..
robocopy origin build-out /e

# Overrides files from ja directory.
robocopy aio-ja/ build-out/aio /e

# Build angular.io
Set-Location build-out

# Apply git patches
git apply -p1 ../scripts/git-patch/*.patch

yarn install --frozen-lockfile --non-interactive
Set-Location aio
yarn build

Set-Location ../../

# Copy robots.txt
robocopy aio-ja/src/robots.txt build-out/aio/dist/ /is

# Modify sitemap
((Get-Content -path build-out/aio/dist/generated/sitemap.xml -Raw) -replace 'angular.io','angular-ja') | Set-Content -Path build-out/aio/dist/generated/sitemap.xml