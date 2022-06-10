export const up = async (knex) => {
  return knex.schema.createTable('planets', (table) => {
    table.increments('id').primary()
    table.string('name')
    table.string('code').unique()
  })
};

export const down = async (knex) => {
  return knex.schema.dropTable('planets')
};
