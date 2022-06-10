import { randomUUID } from 'crypto'
import Knex from 'knex'
import request from 'supertest'
import knexfile from '../../../knexfile.mjs'
import config from '../../../src/config.mjs'
import { createServer } from '../../../src/server.mjs'

const testData = {
  operationName: null,
  variables: {},
  query: `
  {
    spaceCenters(pageSize: 1) {
      pagination {
        total
        page
        pageSize
      }
      nodes {
        id
        uid
        name
        description
        latitude
        longitude
        planet {
          id
          name
          code
        }
      }
    }
  }`
}

describe('bookFlight', () => {
  let server, url

  // before the tests we will spin up a new Apollo Server
  beforeAll(async () => {
    // setup DB
    config.database.connection.filename = `/tmp/${randomUUID()}.sqlite`
    config.database.migrations = knexfile.migrations
    config.database.seeds = knexfile.seeds
    const db = Knex(config.database)
    await db.migrate.latest()
    await db.seed.run()

    // start server
    const app = await createServer()
    const port = Math.floor(Math.random() * (25000 - 1000) + 1000)
    server = app.listen(port)
    url = `http://127.0.0.1:${port}`
  })

  // after the tests we will stop our server
  afterAll(async () => {
    await server.close()
  })

  it('returns expected data', async () => {
    // send our request to the url of the test server
    const response = await request(url).post('/graphql').send(testData)
    expect(response.errors).toBeUndefined()
    expect(response.body.data?.spaceCenters).toStrictEqual({
      pagination: { total: 1038, page: 1, pageSize: 1 },
      nodes: [
        {
          id: '1',
          uid: 'da9c2dee-3b38-4d21-b911-083599c05dad',
          name: 'Hintz Union Space Center',
          description:
            'Aut id sit et. Animi et minus et quia necessitatibus. Aut et perspiciatis veritatis et ut dolores asperiores fugiat.',
          latitude: -35.9083,
          longitude: -34.7214,
          planet: { id: '1', name: 'Mercury', code: 'MER' }
        }
      ]
    })
  })
})
