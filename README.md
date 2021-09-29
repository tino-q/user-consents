## Description

User consent management API built on NestJS (Express), Typeorm and PostgreSQL.

Bundled with docker-compose.

## Installation

```bash
$ npm install
```

## Run all tests and check coverage

Make sure docker daemon is running then:

```bash
$ npm run docker:test
```

## Running on docker

```bash
$ npm run docker
```

Once running Swagger documentation should be available [here](http://localhost:3000/api)

## Running custom PostgreSQL database

```bash
$ cp .env.example .env
```

Edit the .env file to match your database configuration.

Build the code and migrate the database:

```bash
$ npm run build
$ npm run migrate
```

## Start

```bash
$ npm run start

# watch for file changes
$ npm run start:dev
```

## Test

```bash
# unit tests: can be ran without database
$ npm run test

# e2e tests: require database connection
$ npm run test:e2e
```
