#!/bin/bash

# install docker compose from gpt
sudo curl -L "https://github.com/docker/compose/releases/download/$(curl -s https://api.github.com/repos/docker/compose/releases/latest | jq -r .tag_name)/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# start and enable docker service
sudo systemctl start docker
sudo systemctl enable docker
sudo systemctl status docker

# install aws cli in your instance if needed
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# clone the repo
yes | git clone git@github.com:EZPZ-OS/EZPZOS.Express.git

# means npm install
cd EZPZOS.Epress
sudo npm i

cd docker
chmod 755 ./Mac-Up.sh

# need to do aws configure and change to ezpzos role to push image to ecr

