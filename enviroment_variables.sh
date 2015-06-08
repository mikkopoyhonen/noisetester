#!/bin/bash
vagrantid=`vagrant global-status | grep running | cut -c-8`
myip=`/sbin/ifconfig eth0 | grep 'inet addr:' | cut -d: -f2 | awk '{ print $1}'`

command="export API_URL=http://$myip:8001/api && export IO_URL=http://$myip:8001"

echo "**********************************************************************"
echo "* GO TO YOUR CONTRIBOARD GULP TAB AND PASTE TO THE FOLLOWING COMMAND *"
echo "**********************************************************************"
echo $command
