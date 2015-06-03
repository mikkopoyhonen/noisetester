# contriboard-noise
Noise tester for Contriboard

##HOWTO
If you dont yet have docker installed to your machine run:
`sh install_docker.sh`

Then run:
`sh build_remove_run.sh` 
This will build a new dockerimage from this repository, remove the old one and start up a new fresh docker container.

Next:
`sh enviroment_variables.sh`
This will connect to your local vagrant install via SSH and set the `Contriboard-client` enviroment variables to use the `contriboard-noise` haproxy so you will be able to delay some trafic.

Then go to `http://localhost:8002/`:
Click on `Set targets` and set the URL:s where you want the trafic to be delayed to.
Most likely you want to delay the trafic on your local install so you would set:
CB Client: <ip of eth0>:8000
CB API: <ip of eth0>:9002
CB IO: <ip of eth0>:9001

In case you want to test against production or lankku you can set:
CB API: contriboard.n4sjamk.org / lankku.n4sjamk.org
CB IO: contriboard.n4sjamk.org  / lankku.n4sjamk.org

Now to access your contriboard install go to: `http://localhost:8001`
