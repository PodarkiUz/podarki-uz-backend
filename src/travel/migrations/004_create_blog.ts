import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('blogs', function (table) {
    table
      .string('id', 24)
      .defaultTo(knex.raw('generate_object_id()'))
      .primary();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.boolean('is_deleted').defaultTo(false).notNullable();
    
    table.smallint('status').notNullable().defaultTo(0); // 0: draft, 1: published
    table.string('title', 256).notNullable();
    table.text('description').notNullable();
    table.string('author', 64).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('blogs');
}