import { UserInputError } from 'apollo-server-core'
import { insertAndGetId } from '../helpers.mjs'

/*
 * Queries
 */
const bookingQuery = async (parent, { id }, { dataSources }, info) => {
  return dataSources.db('bookings').where({ id }).first('*')
}

const bookingsQuery = async (
  parent,
  { email, page = 1, pageSize = 10 },
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
  const total = dataSources
    .db('bookings')
    .where({ email })
    .count({ count: ['id'] })

  // paginated query
  const bookings = dataSources
    .db('bookings')
    .where({ email })
    .limit(pageSize)
    .offset(pageSize * (page - 1))
    .select('*')

  // wait for both queries to resolve
  const res = await Promise.all([total, bookings])

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
const bookFlightMutation = async (
  parent,
  { bookingInfo },
  { dataSources },
  info
) => {
  // get flight details and number of used seats
  const [flight, bookings] = await Promise.all([
    dataSources.db('flights').where({ id: bookingInfo.flightId }).first('*'),
    dataSources.db('bookings').where({ flight: bookingInfo.flightId }).sum({ used_seats: 'seat_count' })
  ])
  
  // check the flight has seats available
  const availableSeats = flight.seat_count - (bookings[0].used_seats ?? 0)
  if (availableSeats < bookingInfo.seatCount) {
    throw new UserInputError(`only ${availableSeats} seats available`)
  }

  const insertQuery = dataSources.db('bookings').insert({
    seat_count: bookingInfo.seatCount,
    flight: bookingInfo.flightId,
    email: bookingInfo.email
  })

  const id = await insertAndGetId(insertQuery)

  return dataSources.db('bookings').where({ id }).first('*')
}

/*
 * Types
 */
const bookingFlight = (parent, context, { dataSources }, info) => {
  return dataSources.db('flights').where({ id: parent.flight }).first('*')
}

export default {
  Type: {
    Booking: {
      flight: bookingFlight,
      seatCount: (parent) => parent.seat_count
    }
  },

  Query: {
    booking: bookingQuery,
    bookings: bookingsQuery
  },

  Mutation: {
    bookFlight: bookFlightMutation
  }
}
