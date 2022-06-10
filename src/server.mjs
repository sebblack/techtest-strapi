import { dirname } from '@darkobits/fd-name'
import Router from '@koa/router'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { ApolloServer, gql } from 'apollo-server-koa'
import { readdir, readFile } from 'fs/promises'
import knex from 'knex'
import Koa from 'koa'
import path from 'path'
import config from './config.mjs'
import resolvers from './resolvers/index.mjs'
import customScalars, { typeDefs as scalarTypeDefs } from './scalars.mjs'

const loadTypeDefs = async (dir) => {
  const baseDir = path.join(dirname(), '../graphql', dir)
  const files = await readdir(baseDir)

  const typeDefs = []
  for (const fileName of files) {
    const filePath = path.join(baseDir, fileName)
    const file = await readFile(filePath, { encoding: 'utf8' })
    typeDefs.push(gql(file))
  }

  return typeDefs
}

export const createServer = async () => {
  // initialize koa
  const app = new Koa()
  const router = new Router()

  // initialize database
  const db = knex(config.database)
  app.context.db = db

  // initialize graphql
  const gqlServer = new ApolloServer({
    typeDefs: [
      scalarTypeDefs,
      ...(await loadTypeDefs('mutations')),
      ...(await loadTypeDefs('queries')),
      ...(await loadTypeDefs('types'))
    ],
    resolvers: {
      ...customScalars,
      ...resolvers
    },
    dataSources: () => {
      return { db }
    },
    csrfPrevention: false,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()]
  })

  // start graphql server and bind to koa
  await gqlServer.start()
  app.use(gqlServer.getMiddleware({ path: '/graphql' }))

  // bind routes
  app.use(router.routes()).use(router.allowedMethods())
  return app
}
