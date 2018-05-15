exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('states', (table) => {
      table.increments('id').primary();
      table.string('name');
      table.string('abbv');
      table.string('capital');
      table.string('stateHood');
      table.timestamps(true, true)
    }),

    knex.schema.createTable('parks', (table) => {
      table.increments('id').primary();
      table.string('name');
      table.string('date_open');
      table.string('latLong');
      table.string('location');
      table.text('summary');
      table.integer('state_id').unsigned();
      table.foreign('state_id').references('states.id')

      table.timestamps(true, true)
    })
  ])
}

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('parks'),
    knex.schema.dropTable('states')
  ])
}
