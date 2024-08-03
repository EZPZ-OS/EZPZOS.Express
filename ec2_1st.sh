#!/bin/bash

# Update and install packages
sudo yum update -y
sudo yum install -y nodejs npm git docker

# generate the ssh key
ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa
cat ~/.ssh/id_rsa.pub

