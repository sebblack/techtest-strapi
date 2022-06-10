import * as R from 'ramda'
import { loadSeedJson } from '../helpers.mjs'

export const seed = async (knex) => {
  // Check for existing data in table
  const res = await knex('planets').count({ count: ['id'] })
  const count = parseInt(res[0].count, 10)

  // Inserts seed entries if the table is empty
  if (count === 0) {
    const planets = await loadSeedJson('planets.json')
    const data = planets.map((planet, i) => {
      return { id: ++i, ...planet }
    })

    for (const chunk of R.splitEvery(10, data)) {
      await knex('planets').insert(chunk)
    }
  }
}
