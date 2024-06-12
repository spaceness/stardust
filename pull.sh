echo Pulling stardust containers...
echo "" > /tmp/docker.log # overwrite if exists, create it if it doesnt
sudo docker pull ghcr.io/spaceness/debian >> /tmp/docker.log
sudo docker pull ghcr.io/spaceness/chromium >> /tmp/docker.log
sudo docker pull ghcr.io/spaceness/firefox >> /tmp/docker.log
sudo docker pull ghcr.io/spaceness/pinball >> /tmp/docker.log
sudo docker pull ghcr.io/spaceness/debian-kde >> /tmp/docker.log
sudo docker pull ghcr.io/spaceness/gimp >> /tmp/docker.log
echo Done!
