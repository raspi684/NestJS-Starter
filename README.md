## Requirements

* docker
* docker-compose
* make
* node 16.13
* npm 8

## Installation

```bash
npm install
```
Create `.env` using `.env.example`.

***docker-compose* and *makefile* load .env file**

## Running the app

```bash
# start dev (watcher + debugger)
make start

# start only DB
make start-db

# stop containers
make stop

# stop containers and remove docker image
make stop-and-remove-image

# generate migration (DB_LOCALHOST=1 override db host from .env)
make generate-migration DB_LOCALHOST=1 NAME=MigrationName

# revert migration (DB_LOCALHOST=1 override db host from .env)
make revert-migration DB_LOCALHOST=1
```
