requirements = postgres #mongodb rabbitmq
services = service-registry file-service item-service main-service ui-app

.PHONY: start
start:
	make start-requirements start-services

.PHONY: build
build:
	./build-helper.sh -c install
	docker compose build --no-cache $(services)

.PHONY: start-services
start-services:
	docker compose up $(services)

.PHONY: stop-services
stop-services:
	docker compose stop $(services)

.PHONY: start-requirements
start-requirements:
	docker compose up -d $(requirements)

.PHONY: stop-requirements
stop-requirements:
	docker compose stop $(requirements)

.PHONY: remove-containers
remove-containers:
	@echo "Removing all stopped containers..."
	docker compose rm $(services) $(requirements)

.PHONY: burn
burn:
	@echo "Stopping and removing all containers..."
	make stop-services stop-requirements remove-containers

.PHONY: clean-data
clean-data:
	rm -rf .docker/**/data

.PHONY: reset
reset:
	make burn clean-data start

default: start
