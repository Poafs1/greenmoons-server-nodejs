# Greenmoons interview assignment

## Requirement

1. `.env`
2. ormconfig.json

## Project Setup

**Step 1**: Create `.env` from `.env.example`

```sh
cp .env.example .env
```

> If you want to connect the app to local database, please update `PG_HOST=localhost`

**Step 2**: Package install

```sh
yarn install
```

## Database Setup

**Step 1**: Initialize database with Docker

```sh
docker-compose -f docker-compose-db.dev.yaml up --build
```

**Step 2**: Run database migration

```sh
yarn pg:migration:run
```

**Step 3**: Initialize mockup data (optional)

```sh
yarn pg:init:data
```

## Running Project

### In Development

#### Locally

```sh
yarn start:dev
```

#### With Docker

```sh
docker-compose -f docker-compose.dev.yaml up --build
```

### In Build

```sh
yarn build
```

```sh
yarn start
```

## API Spec

OpenAPI (Swagger)

```sh
http://{HOST}:{PORT}/api/spec
```

## Unit Test

```sh
yarn test
```
