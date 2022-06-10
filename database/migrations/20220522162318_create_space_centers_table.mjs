export const up = async (knex) => {
  return knex.schema.createTable('space_centers', (table) => {
    table.increments('id').primary()
    table.string('uid').unique()
    table.string('name')
    table.string('description', 2048)
    table.float('latitude')
    table.float('longitude')

    // planet
    table.string('planet_code')
    table.foreign('planet_code').references("code").inTable('planets')
  })
}

export const down = async (knex) => {
  return knex.schema.dropTable('space_centers')
}
