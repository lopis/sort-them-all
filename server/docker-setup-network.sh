#!/bin/bash

# Define the custom network and the third-party image name
NETWORK_NAME="pokeapi_network"
THIRD_PARTY_IMAGE="pokeapi-web"

# Get the container ID of the third-party container
CONTAINER_ID=$(docker ps --filter "name=$THIRD_PARTY_IMAGE" --format "{{.ID}}")

echo $CONTAINER_ID

# Check if the container ID is found
if [ -z "$CONTAINER_ID" ]; then
  echo "Third-party container not found."
  exit 1
fi

# Create the network if not yet existing
docker network create $NETWORK_NAME
# Connect the third-party container to the custom network
docker network connect $NETWORK_NAME $CONTAINER_ID
docker network connect $NETWORK_NAME server-node-1

echo "Connected third-party container ($CONTAINER_ID) to network $NETWORK_NAME."
