# contriboard-noise
Noise tester for Contriboard. The tool will generate configurable network condition and so emulate a bad network connection. This repository will build a docker container that will run a small express web server with management gui and api. The docker container also has a haxproxy to redirect trafic.

####Install docker
If you dont yet have docker installed to your machine run:
`sh install_docker.sh`

####Build the docker container
`sh build_remove_run.sh` 
This will build a new dockerimage from this repository, remove the old one and start up a new fresh docker container. 

To use different set of ports, you can modify the `build_remove_run.sh` file and change the first parts of -p parameter. For example if you want that you can access your contriboard in port 5000 instead of 80, you  can change the `-p 80:8001` to `-p 5300:8001`.

####Start contriboard with custom enviroment variables
First make sure that you have started contriboard-api and contriboard-io at your vagrant machine.

There is a ready made script called `start_services.sh` in the contriboard-start folder when you cloned the development repository. You can also start the `io` and `api` services in separate tabs. (Hint: `vagrant global-status`, `vagrant ssh <id>`, `cd teamboard-io` / `cd teamboard-api` and `npm start` for both)

If you are sure the `io` and `api` services are already running, then you can just:

`sh noise_start_contriboard.sh`
This will connect to your vagrant machine via ssh and kill old contriboard nodejs process and start a new one with correct enviroment variables. 

_Note: You may need to edit `noise_start_contriboard.sh` in case your network interface is something else than eth0!_

####Configure the targets
Access the management GUI at: `http://localhost:8002`

Click on `Set targets` and set the URL:s where you want the trafic to be delayed and relayed to.
Most likely you want to delay the trafic on your local install so you would set:
- CB Client: `<ip of your machine>:8000`
- CB API: `<ip of your machine>:9002`
- CB IO: `<ip of your machine>:9001`

You can get your ip address by typing `hostname -I` to your bash.

Now to access your contriboard install go to: `http://localhost:80`

### API
You are able to send configuration parameters in `application/json` format to configure the noise container.

#### /limit
*Method:* PUT

*Parameters:* limit, delay, delayvariance, corrupt, duplicate, loss, reorder, rate

*Usage:* This will set the noise emulation.

*Example:*
```json
{
    "delay": 10,
    "loss": 5,
    "corrupt": 1
}
```

***

#### /script
*Method:* PUT

*JSON parameters:* limit, delay, delayvariance, corrupt, duplicate, loss, reorder, rate
*Other parameters:* loop, jsonscript(of json parameters)

*Usage:* Will start running the defined parameters. This is similar to /limit but with set time delays. 

*Example:*
In the begining (at 0 seconds) loss will be set to 20% and delay to 5ms. After 5 seconds from the script start loss is set to 10% and delay to 2ms.
```json
{
    "jsonscript": {
        "0": {
            "loss": 20,
            "delay": 5
        },
        "5": {
            "loss": 10,
            "delay": 2
        }
    },
    "loop": 0
}
```

***

#### /limit/reset
*Method:* PUT

*Usage:* This will reset all delays and settings to 0.

***

#### Parameter description
*limit*
(packet amount) Limits the effect of selected options to the indicated number of next packets.

*delay*
(milliseconds) Delay packet traffic by set amount.

*delayvariance*
(milliseconds) REQUIRES delay. Optional parameter for delay which introduces a delay variation.

*corrupt*
(percent) Allows the emulation of random noise introducing an error in a random position for a chosen percent of packets.

*duplicate*
(percent) Duplicates the chosen percent of packets before queuing them.

*loss*
(percent) Adds an independent loss probability to the packets outgoing from the chosen network interface.

*reorder*
(percent) REQUIRES delay. Set percent of packets are sent immediately, while others are delayed by set delay time

*rate*
(bits) Delay packets based on packet size.
