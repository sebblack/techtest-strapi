/**
 * Server config
 */
export const server = {
  host: '0.0.0.0',
  port: 3000
}

/**
 * Database config
 */
export const databaseClient = process.env.DB_CLIENT || 'sqlite3'
const databaseConfigs = {
  sqlite3: {
    client: 'sqlite3',
    connection: {
      filename: process.env.DB_FILENAME || './strapi-tech-test.sqlite'
    },
    useNullAsDefault: true
  },
  pg: {
    client: 'pg',
    version: process.env.DB_VERSION || '14.3',
    connection: {
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USERNAME || 'strapi',
      password: process.env.DB_PASSWORD || 'strapi',
      database: process.env.DB_DATABASE || 'strapi-tech-test'
    }
  }
}
/** @type import("knex").Knex.Config */
export const database = databaseConfigs[databaseClient]

export default { server, database }
