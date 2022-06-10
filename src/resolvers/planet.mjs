/*
 * Queries
 */
const planetsQuery = (parent, context, { dataSources }, info) => {
  return dataSources.db('planets').select('*')
}

/*
 * Types
 */
const planetSpaceCenters = (parent, { limit }, { dataSources }, info) => {
  const query = dataSources
    .db('space_centers')
    .where({ planet_code: parent.code })

  if (limit !== undefined) {
    query.limit(limit)
  }

  return query.select('*')
}

export default {
  Type: {
    Planet: {
      spaceCenters: planetSpaceCenters
    }
  },

  Query: {
    planets: planetsQuery
  }
}
