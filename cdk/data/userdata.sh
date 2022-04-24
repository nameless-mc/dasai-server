#!/bin/bash
cp -p /usr/share/zoneinfo/Japan /etc/localtime
echo ZONE="Asia/Tokyo" > /etc/sysconfig/clock
echo UTC=False >>  /etc/sysconfig/clock

yum update -y && yum install -y docker git
systemctl start docker
systemctl enable docker
usermod -a -G docker ec2-user

curl -L "https://github.com/docker/compose/releases/download/v2.2.3/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod 777 /usr/local/bin/docker-compose
ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
chmod 777 /usr/bin/docker-compose

mkdir /app
chmod +777 /app