#!/bin/bash
vagrantid=`vagrant global-status | grep running | cut -c-8`
myip=`/sbin/ifconfig eth0 | grep 'inet addr:' | cut -d: -f2 | awk '{ print $1}'`

command="export API_URL=http://$myip:80/api && export IO_URL=http://$myip:80 && fuser -k 8000/tcp ; cd /home/vagrant/teamboard-client-react/ && gulp"

echo "**********************************************************************"
echo "*  Will now connect to your vagrant session to restart contriboard   *"
echo "**********************************************************************"
echo $command

vagrant ssh $vagrantid -- -t "$command"
