import { UserInputError } from 'apollo-server-core'
import { insertAndGetId } from '../helpers.mjs'

/*
 * Queries
 */
const flightQuery = (parent, { id }, { dataSources }, info) => {
  return dataSources.db('flights').where({ id }).first('*')
}

const flightsQuery = async (
  parent,
  { page = 1, pageSize = 10 },
  { dataSources },
  info
) => {
  if (page < 1) {
    throw new UserInputError('page must be greater than 1')
  }

  if (pageSize < 1 || pageSize > 100) {
    throw new UserInputError('pageSize must be between 1 and 100')
  }

  // count total items
  const total = dataSources.db('flights').count({ count: ['id'] })

  // paginated query
  const flights = dataSources
    .db('flights')
    .limit(pageSize)
    .offset(pageSize * (page - 1))
    .select('*')

  // wait for both queries to resolve
  const res = await Promise.all([total, flights])

  return {
    pagination: {
      total: parseInt(res[0][0].count, 10),
      page,
      pageSize
    },
    nodes: res[1]
  }
}

/*
 * Mutations
 */
const scheduleFlightMutation = async (
  parent,
  { flightInfo },
  { dataSources },
  info
) => {
  const insertQuery = dataSources.db('flights').insert({
    launch_site: flightInfo.launchSiteId,
    landing_site: flightInfo.landingSiteId,
    departure_at: flightInfo.departureAt,
    seat_count: flightInfo.seatCount
  })

  const id = await insertAndGetId(insertQuery)

  return dataSources.db('flights').where({ id }).first('*')
}

/*
 * Types
 */
const flightSpaceCenter = (field) => {
  return (parent, context, { dataSources }, info) => {
    return dataSources
      .db('space_centers')
      .where({ id: parent[field] })
      .first('*')
  }
}

const availableSeats = async (parent, context, { dataSources }, info) => {
  const bookings = await dataSources.db('bookings').where({ flight: parent.id }).sum({ used_seats: 'seat_count' })
  const usedSeats = bookings[0].used_seats ?? 0
  return parent.seat_count - usedSeats
}

export default {
  Type: {
    Flight: {
      launchSite: flightSpaceCenter('launch_site'),
      landingSite: flightSpaceCenter('landing_site'),
      availableSeats,
      seatCount: (parent) => parent.seat_count,
      departureAt: (parent) => parent.departure_at
    }
  },

  Query: {
    flight: flightQuery,
    flights: flightsQuery
  },

  Mutation: {
    scheduleFlight: scheduleFlightMutation
  }
}
