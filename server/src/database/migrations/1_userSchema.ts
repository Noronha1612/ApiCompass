import Knex from 'knex';
import crypto from 'crypto';

export async function up(knex: Knex) {
  return knex.schema.createTable('users', table => {
    table.string('id').notNullable();
    table.string('name').notNullable();
    table.string('email').notNullable();
    table.string('country').notNullable();
    table.string('password').notNullable();
    table.string('api_ids');
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('users');
}