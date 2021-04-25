services = postgres service-registry auth-service

.PHONY: start
start:
	make build-services start-services

start-services:
	docker-compose up $(services)

build-services:
	docker-compose build $(services)

stop-services:
	docker-compose stop $(services)

remove-containers:
	@echo "Removing all stopped containers..."
	docker-compose rm $(services)

burn:
	@echo "Stopping and removing all containers..."
	make stop-services && make remove-containers

clean-data:
	rm -rf ./docker/**/data

reset:
	make burn clean-data start

default: start
