import { UserInputError } from 'apollo-server-core'

/*
 * Queries
*/
const spaceCenterQuery = (parent, { id, uid }, { dataSources }, info) => {
  return dataSources
    .db('space_centers')
    .where({
      ...(id && { id }),
      ...(uid && { uid })
    })
    .first('*')
}

const spaceCentersQuery = async (
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
  const total = dataSources.db('space_centers').count({ count: ['id'] })

  // paginated query
  const spaceCenters = dataSources
    .db('space_centers')
    .limit(pageSize)
    .offset(pageSize * (page - 1))
    .select('*')

  // wait for both queries to resolve
  const res = await Promise.all([total, spaceCenters])

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
 * Types
 */
const spaceCenterPlanet = (parent, context, { dataSources }, info) => {
  return dataSources
    .db('planets')
    .where({ code: parent.planet_code })
    .first('*')
}

export default {
  Type: {
    SpaceCenter: {
      planet: spaceCenterPlanet
    }
  },

  Query: {
    spaceCenter: spaceCenterQuery,
    spaceCenters: spaceCentersQuery
  }
}
