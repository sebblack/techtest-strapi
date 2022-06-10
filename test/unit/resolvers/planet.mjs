import planetResolver from '../../../src/resolvers/planet.mjs'
import knex from 'knex'

const filename = Math.random().toString(16).substr(2, 32)
const db = knex({ client: 'sqlite3', connection: {
  filename: `/tmp/strapi-tech-test-${filename}.sqlite`
}})

describe('planetResolver', () => {
  test('planetsQuery lists all planets', () => {
    const query = planetResolver.Query.planets(undefined, undefined, { dataSources: { db } }, undefined)
    expect(query.toSQL().sql).toBe("select * from `planets`")
  })
})