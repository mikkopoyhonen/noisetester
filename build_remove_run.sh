sudo docker stop contriboard-noise
sudo docker rm contriboard-noise
sudo docker rmi temetz/contriboard-noise
sudo docker build -t temetz/contriboard-noise .
sudo docker run -i -t -d -p 8001:8001 -p 8002:8002 --privileged --name contriboard-noise temetz/contriboard-noise
echo "Remember to set your API_URL and IO_URL enviroment variables"
