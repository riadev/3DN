#!/bin/sh
/etc/init.d/redis-server start
cd /opt/3dn/
tail -f /var/log/redis/redis-server.log
#forever  start node_modules/.bin/actionhero
#forever logs 0