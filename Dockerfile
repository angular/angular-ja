FROM node:14

# install dependencies
RUN apt-get update
RUN apt-get install -y rsync
RUN npm i -g zx

# copy source files
WORKDIR /
COPY .git .git
COPY origin /origin/
COPY aio-ja /aio-ja/
COPY scripts /scripts/
WORKDIR /origin
RUN git clean -xdn

# build aio
WORKDIR /
CMD zx ./scripts/dockerbuild/build-aio.mjs
