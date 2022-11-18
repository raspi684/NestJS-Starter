# Load .env if exists
ifneq (,$(wildcard ./.env))
    include .env
    export
endif

ifdef DB_LOCALHOST
$(info DB host is now localhost)
POSTGRES_HOST=localhost
endif

#
# Scripts
#

help:
	@egrep -h '\s##\s' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m  %-30s\033[0m %s\n", $$1, $$2}'

start:	## Start db and api
	docker-compose up -d

start-db:	## Start only db
	docker-compose up -d db

start-api:	## Start only api (when you want see logs)
	docker-compose up api

stop:	## Stop api and db
	docker-compose stop

stop-api:	## Stop only api
	docker-compose stop api

stop-and-remove-image:	## Stop api and db then remove api image
	docker-compose down --rmi local

generate-migration:	## Generate migration
	npm run typeorm:migration:generate -- ${NAME}

revert-migration:	## Revert migration
	npm run typeorm:migration:revert

build:	## Build app
	npm run build
