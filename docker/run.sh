#!/bin/sh
/etc/init.d/redis-server start
/opt/riadns/node_modules/actionhero/bin/actionhero
#forever  start node_modules/.bin/actionhero
#forever logs 0