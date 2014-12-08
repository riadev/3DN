FROM      dockerfile/nodejs
MAINTAINER RIADEV  "github@riadev.info"

ENV DEBIAN_FRONTEND noninteractive
ENV BASE_DOMAIN riadev.in;
ENV SCHEDULE_TASK true;
ENV DOCKER_HOSTS 192.168.210.250:4243;
ENV DNS_PORT 53;
ENV SERVER_NAME DNSSERVER;
ENV NODE_ENV production
ENV ROS_HOST 192.168.1.1
ENV ROS_USER ros
ENV ROS_PASSWD passwd
ENV ACTIONHERO_CONFIG /opt/riadns/config

VOLUME ["/var/lib/redis"]

ADD run.sh /run.sh
RUN apt-get update
RUN apt-get install -y --force-yes  redis-server rsyslog openssh-server


RUN npm install -g npm@latest
RUN npm install -g forever
RUN npm install riadns
RUN mv /data/node_modules/riadns/ /opt/riadns
RUN mkdir -p  /opt/riadns/log/

RUN chmod +x /run.sh
RUN chmod +x /opt/riadns/*.js

EXPOSE 22

CMD ["/run.sh"]