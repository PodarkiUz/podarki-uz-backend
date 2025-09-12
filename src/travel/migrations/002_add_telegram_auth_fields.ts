import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('travelers', function (table) {
    // Add Telegram authentication fields
    table.bigInteger('telegram_id').unique(); // Telegram user ID
    table.enum('auth_provider', ['phone', 'google', 'telegram', 'telegram_gateway']).defaultTo('phone'); // Authentication provider
    table.text('photo_url'); // Telegram photo URL
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('travelers', function (table) {
    table.dropColumn('telegram_id');
    table.dropColumn('auth_provider');
    table.dropColumn('photo_url');
  });
}
