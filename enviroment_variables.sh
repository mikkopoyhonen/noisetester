#!/bin/bash
myip=`/sbin/ifconfig eth0 | grep 'inet addr:' | cut -d: -f2 | awk '{ print $1}'`
command="export API_URL=http://$myip:8001/api && export IO_URL=http://$myip:8001"
vagrant ssh -c $command


