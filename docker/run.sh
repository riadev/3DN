#!/bin/bash
/etc/init.d/redis-server start
/etc/init.d/rsyslog start
forever -o >(logger -t dns_log) -e >(logger -t dns_error)  --sourceDir=/opt/riadns/ --workingDir=/opt/riadns/  node_modules/actionhero/bin/actionhero