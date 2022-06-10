import * as R from 'ramda'
import { loadSeedJson } from '../helpers.mjs'

export const seed = async (knex) => {
  // Check for existing data in table
  const res = await knex('space_centers').count({ count: ['id'] })
  const count = parseInt(res[0].count, 10)

  // Inserts seed entries if the table is empty
  if (count === 0) {
    const spaceCenters = await loadSeedJson('space-centers.json')
    const data = spaceCenters.map((spaceCenter, i) => {
      return { id: ++i, ...spaceCenter }
    })

    for (const chunk of R.splitEvery(10, data)) {
      await knex('space_centers').insert(chunk)
    }
  }
}
