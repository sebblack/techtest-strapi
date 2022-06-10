FROM node:gallium-alpine as build
WORKDIR /app

ADD package.json /app
ADD package-lock.json /app
RUN npm ci

FROM node:gallium-alpine
WORKDIR /app

COPY --from=build /app /app

ADD ./src /app/src
ADD ./graphql /app/graphql
ADD ./database /app/database
ADD knexfile.mjs /app

ENTRYPOINT [ "node", "src/start.mjs" ]