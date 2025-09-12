import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('telegram_gateway_otp', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('generate_object_id()'));
    table.string('phone_number', 20).notNullable();
    table.string('request_id', 100).notNullable().unique();
    table.timestamp('expires_at').notNullable();
    table.boolean('is_used').defaultTo(false);
    table.integer('attempts').defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index('phone_number');
    table.index('request_id');
    table.index('expires_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('telegram_gateway_otp');
}
