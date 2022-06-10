import { gql } from 'apollo-server-koa'
import { GraphQLScalarType, Kind } from 'graphql'

const dateScalar = new GraphQLScalarType({
  name: 'Date',

  description: 'Date custom scalar type',

  // Convert outgoing Date to string for JSON
  serialize(value) {
    // cast to date if not (e.g. postgres value)
    if (!(value instanceof Date)) {
      value = new Date(value)
    }

    return value.toISOString()
  },

  // Convert incoming string to Date
  parseValue(value) {
    return new Date(value)
  },

  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value) // Convert hard-coded string to Date
    }

    return null // Invalid hard-coded value
  }
})

export const typeDefs = gql`
  scalar Date
`
export default { Date: dateScalar }
