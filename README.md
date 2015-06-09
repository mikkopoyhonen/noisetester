# contriboard-noise
Noise tester for Contriboard

##HOWTO
If you dont yet have docker installed to your machine run:
`sh install_docker.sh`

####Then run
`sh build_remove_run.sh` 
This will build a new dockerimage from this repository, remove the old one and start up a new fresh docker container.

####Next
`sh start_contriboard.sh`
This will connect to your vagrant via ssh and kill old contriboard nodejs process and start a new one with correct enviroment variables.

####Then 
Go to `http://localhost:8002/`

Click on `Set targets` and set the URL:s where you want the trafic to be delayed to.
Most likely you want to delay the trafic on your local install so you would set:
- CB Client: `<ip of eth0>:8000`
- CB API: `<ip of eth0>:9002`
- CB IO: `<ip of eth0>:9001`

You can get your ip address by typing `hostname -I` to your bash.

In case you want to test against production or lankku you can set:
- CB API: contriboard.n4sjamk.org / lankku.n4sjamk.org
- CB IO: contriboard.n4sjamk.org  / lankku.n4sjamk.org

Now to access your contriboard install go to: `http://localhost:8001`
