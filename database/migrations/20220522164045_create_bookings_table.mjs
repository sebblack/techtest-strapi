export const up = async (knex) => {
  return knex.schema.createTable('bookings', (table) => {
    table.increments('id').primary()
    table.integer('seat_count')
    table.string('email')

    // flights
    table.integer('flight')
    table.foreign('flight').references('id').inTable('flights')
  })
}

export const down = async (knex) => {
  return knex.schema.dropTable('bookings')
}
