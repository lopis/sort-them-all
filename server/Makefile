# Makefile

.PHONY: docker-network docker-build docker-up

network:
	./docker-setup-network.sh

build:
	docker compose build

start:
	docker compose up --build -d

restart:
  docker compose down
  docker compose up --build -d
  ./docker-setup-network.sh
