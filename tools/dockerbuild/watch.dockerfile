FROM node:16.16.0

# install dependencies
RUN apt-get update
RUN apt-get install -y rsync
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# copy source files
WORKDIR /
COPY origin /origin/
COPY tools/dockerbuild/package.json /
RUN yarn install --no-lockfile
COPY .git/modules .git/modules/
WORKDIR /origin
RUN git clean -xdn


# setup aio
WORKDIR /
COPY aio-ja /aio-ja/
COPY scripts /scripts/
COPY tools/dockerbuild/scripts/apply-localization.mjs tools/dockerbuild/scripts/setup-aio.mjs /
RUN npx zx apply-localization.mjs
RUN npx zx setup-aio.mjs

# start aio
WORKDIR /
COPY tools/dockerbuild/scripts/watch-aio.mjs /
CMD npx zx watch-aio.mjs
