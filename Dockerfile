FROM library/ubuntu:14.04

MAINTAINER Temetz

RUN echo deb http://archive.ubuntu.com/ubuntu trusty-backports main universe > /etc/apt/sources.list.d/backports.list
RUN apt-get update && apt-get install -y software-properties-common
RUN apt-get update && apt-get install -y iptables
RUN apt-get update && apt-get install -y nodejs npm
RUN apt-get update && apt-get install -y haproxy -t trusty-backports

RUN ln -s /usr/bin/nodejs /usr/bin/node

COPY /haproxy/haproxy.cfg /etc/haproxy/haproxy.cfg

COPY /api /api
RUN cd /api/src;npm install

EXPOSE 8001
EXPOSE 8002

CMD sudo service haproxy restart && sudo tc qdisc add dev lo root netem loss 0% delay 0ms && node /api/src/index.js
