# makefile internals
args = `arg="$(filter-out $@,$(MAKECMDGOALS))" && echo $${arg:-${1}}`
help: ## Display this help.
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

# binary aliases
KNEX = npx knex --knexfile knexfile.mjs

##@ Dependencies
.PHONY: install install-node

install: install-tools install-node ## Install all dependencies

install-tools: ## Install runtimes
	@echo "Installing tooling"
	asdf install

install-node: ## Install Node.js dependencies
	@echo "Installing Node.js packages"
	npm i

##@ Lint
.PHONY: lint lint-fix

lint: ## Run linters
	@echo "linting code"
	npx eslint --ext .mjs --ignore-path .gitignore .

lint-fix: ## Automatically fix lintint errors
	@echo "fixing linting issues"
	npx eslint --fix --ext .mjs --ignore-path .gitignore .

##@ Testing
.PHONY: test

test: ## Run all tests
	@echo "running unit tests"
	NODE_OPTIONS=--experimental-vm-modules npx jest

##@ Helpers
.PHONY: create-migration migrate seed start start-docker

create-migration: ## Create a new migration file
	@echo "Creating new migration"
	$(KNEX) migrate:make $(call args)

migrate: ## Run migrations
	@echo "Running migrations"
	$(KNEX) migrate:latest

seed: ## Run seeders
	@echo "seeding database"
	$(KNEX) seed:run

start: ## start api server locally
	@echo "starting basic api server"
	node src/start.mjs

start-docker: ## Start docker containers
	@echo "building and running containers"
	docker-compose up --build
