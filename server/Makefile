# Makefile

.PHONY: docker-network docker-build docker-up

docker-network:
    ./docker-setup-network.sh

docker-build:
    docker compose build

docker-up:
    docker compose up --build -d
