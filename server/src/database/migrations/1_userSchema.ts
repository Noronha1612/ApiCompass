import Knex from 'knex';
import crypto from 'crypto';

export async function up(knex: Knex) {
  return knex.schema.createTable('users', table => {
    table.string('id').notNullable();
    table.string('name').notNullable();
    table.string('email').notNullable();
    table.string('country').notNullable();
    table.string('password').notNullable();
    table.string('api_ids').notNullable();
    table.string('liked_apis').notNullable();
    table.string('followers').notNullable();
    table.string('following').notNullable();
    table.integer('score').notNullable();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('users');
}