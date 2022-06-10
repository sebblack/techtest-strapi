# Strapi tech test

Largely everything is controlled via the Makefile, which has a built in help command `make help`.
The Node.JS runtime can be installed using [asdf](https://github.com/asdf-vm/asdf-nodejs),
you can also automate installing node and npm by using `make install`

Why is this built with ECMAscript modules which is both experimental, and makes Jest a pain to use?
because I wanted to try something new, and to get more experience with using GraphQL normally, rather than the auto-generated
TypeScript variant.

The server can be configured using Environment Variables, though the main different is switching between `sqlite3` and `postgres`,
though it's automatically configured for each mode of running listed below.

| name          | default                   | description                                                     |
| ------------- | ------------------------- | --------------------------------------------------------------- |
| `DB_CLIENT`   | `sqlite3`                 | Which database driver to use (only supports `sqlite3` and `pg`) |
| `DB_FILENAME` | `strapi-tech-test.sqlite` | Filename to use when running with `sqlite3`                     |
| `DB_VERSION`  | `14.3`                    | Postgres version                                                |
| `DB_HOST`     | `127.0.0.1`               | IP address of postgres server                                   |
| `DB_PORT`     | `127.0.0.1`               | port of postgres server                                         |
| `DB_DATABASE` | `strapi-tech-test`        | DB schema to connect to                                         |
| `DB_USERNAME` | `strapi`                  | DB authentication username                                      |
| `DB_PASSWORD` | `strapi`                  | DB authentication password                                      |

## Running tests

You can run all the tests by using `make test`.

## Starting the server

### With docker

The server can be built to run with postgres inside docker using `make start-docker` (or normal `docker-compose up`).

### Without docker

For faster debugging the server can also just run directly with nodejs, in this case it will fall back to `sqlite3`
for the database. `make start` or `node src/server.mjs`
