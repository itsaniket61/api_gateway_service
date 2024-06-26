#!/bin/bash

source docker.creds

echo ${USERNAME}
docker login -u "${USERNAME}" -p "${PASSWORD}"

docker-compose pull gatewayservice
docker-compose pull cloudkeeper
docker-compose pull crafter

docker-compose up -d