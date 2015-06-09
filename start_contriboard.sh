#!/bin/bash
vagrantid=`vagrant global-status | grep running | cut -c-8`
myip=`/sbin/ifconfig eth0 | grep 'inet addr:' | cut -d: -f2 | awk '{ print $1}'`

command="export API_URL=http://192.168.142.20:8001/api && export IO_URL=http://192.168.142.20:8001 && fuser -k 8000/tcp ; cd /home/vagrant/teamboard-client-react/ && gulp"

echo "**********************************************************************"
echo "* GO TO YOUR CONTRIBOARD GULP TAB AND PASTE TO THE FOLLOWING COMMAND *"
echo "**********************************************************************"
echo $command

vagrant ssh $vagrantid -- -t "$command"
