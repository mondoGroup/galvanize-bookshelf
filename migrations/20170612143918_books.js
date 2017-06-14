'use strict';

exports.up = function(knex, Promise) {
  // UP adds / creates tables / fields to the DB
  return knex.schema.createTable('books', (table) => {
    table.increments('id').primary();
    table.string('title').notNullable().defaultTo('');
    table.string('author').notNullable().defaultTo('');
    table.string('genre').notNullable().defaultTo('');
    table.text('description').notNullable().defaultTo('');
    table.text('cover_url').notNullable().defaultTo('');
    table.timestamps(true, true);
    table.unique('id');
  })
};

exports.down = function(knex, Promise) {
  // DROP deletes /drops tables/fields from DB
  return knex.schema.dropTable('books');

};
