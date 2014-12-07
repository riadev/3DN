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

VOLUME ["/var/lib/redis"]

RUN apt-get update
RUN apt-get install -y --force-yes  redis-server


RUN npm install -g npm@latest
RUN npm install -g forever
RUN git help -a
RUN git clone https://github.com/riadev/3DN.git
RUN mv 3DN /opt/3dn
RUN npm install /opt/3dn
RUN chmod +x /opt/3dn/docker/run.sh
RUN chmod +x /opt/3dn/*.js

EXPOSE 8353
EXPOSE 53
EXPOSE 8080
EXPOSE 80

CMD ["/opt/3dn/docker/run.sh"]