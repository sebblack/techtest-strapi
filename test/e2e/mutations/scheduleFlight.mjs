import { randomUUID } from 'crypto'
import Knex from 'knex'
import request from 'supertest'
import knexfile from '../../../knexfile.mjs'
import config from '../../../src/config.mjs'
import { createServer } from '../../../src/server.mjs'

const testData = {
  operationName: 'scheduleFlight',
  variables: {
    flight: {
      launchSiteId: 3,
      landingSiteId: 4,
      departureAt: '2022-05-24T12:25:54Z',
      seatCount: 50
    }
  },
  query: `
  mutation scheduleFlight($flight: ScheduleFlightInput!) {
    scheduleFlight(flightInfo: $flight) {
      id
      code
      launchSite {
        name
        planet {
          name
        }
      }
      landingSite {
        name
        planet {
          name
        }
      }
      availableSeats
      seatCount
      departureAt
    }
  }`
}

describe('scheduleFlight', () => {
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
    expect(response.body.data?.scheduleFlight).toStrictEqual({
      id: '1',
      code: null,
      launchSite: {
        name: 'Nayeli Island Space Center',
        planet: {
          name: 'Mercury'
        }
      },
      landingSite: {
        name: 'Tina Motorway Space Center',
        planet: {
          name: 'Mercury'
        }
      },
      availableSeats: 50,
      seatCount: 50,
      departureAt: '2022-05-24T12:25:54.000Z'
    })
  })
})
