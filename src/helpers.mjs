import { lensPath, view } from 'ramda'
import { databaseClient } from './config.mjs'

export const insertAndGetId = async (query) => {
  let idKey = lensPath([0])
  if (databaseClient === 'pg') {
    query.returning(['id'])
    idKey = lensPath([0, 'id'])
  }

  const inserted = await query
  return view(idKey, inserted)
}