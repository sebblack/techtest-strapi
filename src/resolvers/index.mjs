import booking from './booking.mjs'
import flight from './flight.mjs'
import planet from './planet.mjs'
import spaceCenter from './spaceCenter.mjs'

export default {
  // types
  ...spaceCenter.Type,
  ...planet.Type,
  ...flight.Type,
  ...booking.Type,

  // queries
  Query: {
    ...planet.Query,
    ...spaceCenter.Query,
    ...flight.Query,
    ...booking.Query
  },

  // mutations
  Mutation: {
    ...flight.Mutation,
    ...booking.Mutation
  }
}
