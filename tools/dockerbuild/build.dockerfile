FROM node:14.16

# install dependencies
RUN apt-get update
RUN apt-get install -y rsync

# copy source files
WORKDIR /
COPY origin /origin/
COPY tools/dockerbuild/package.json /
RUN yarn install --no-lockfile
COPY .git .git/
WORKDIR /origin
RUN git clean -xdn

# build aio
WORKDIR /
COPY tools/dockerbuild/scripts/* /
CMD npx zx build-aio.mjs
