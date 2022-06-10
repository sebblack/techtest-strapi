import { database } from './src/config.mjs'

export default {
  ...database,
  migrations: {
    directory: './database/migrations',
    tableName: 'migrations',
    loadExtensions: ['.mjs']
  },
  seeds:  {
    directory: './database/seeds',
    loadExtensions: ['.mjs']
  }
}