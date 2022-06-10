export const up = async (knex) => {
  return knex.schema.createTable('flights', (table) => {
    table.increments('id').primary()
    table.string('code')
    table.datetime('departure_at')
    table.integer('seat_count')

    // launch site
    table.integer('launch_site')
    table.foreign('launch_site').references('id').inTable('space_centers')

    // landing site
    table.integer('landing_site')
    table.foreign('landing_site').references('id').inTable('space_centers')
  })
}

export const down = async (knex) => {
  return knex.schema.dropTable('flights')
}
