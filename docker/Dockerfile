FROM      dockerfile/nodejs
MAINTAINER RIADEV  "github@riadev.info"

ENV DEBIAN_FRONTEND noninteractive

apt-get update
apt-get install -y --force-yes  redis-server

npm install -g npm@latest
npm install -g forever
npm install riadns