requirements = mongodb# postgres rabbitmq
services = service-registry auth-service

.PHONY: start
start:
	make build-services start-requirements start-services

start-services:
	docker-compose up $(services)

build-services:
	docker-compose build $(services)

stop-services:
	docker-compose stop $(services)

start-requirements:
	docker-compose up -d $(requirements)

stop-requirements:
	docker-compose stop $(requirements)

remove-containers:
	@echo "Removing all stopped containers..."
	docker-compose rm $(services) $(requirements)

burn:
	@echo "Stopping and removing all containers..."
	make stop-services stop-requirements remove-containers

clean-data:
	rm -rf .docker/**/data

reset:
	make burn clean-data start

default: start
