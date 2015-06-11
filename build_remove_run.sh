sudo docker stop contriboard-noise
sudo docker rm contriboard-noise
sudo docker rmi temetz/contriboard-noise
sudo docker build -t temetz/contriboard-noise .
sudo docker run -i -t -d -e "NOISEPORT=8002" -p 80:8001 -p 8002:8002 --privileged --name contriboard-noise temetz/contriboard-noise
echo "Next: run: sh noise_start_contriboard.sh"
