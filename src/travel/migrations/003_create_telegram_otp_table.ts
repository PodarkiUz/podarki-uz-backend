import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('telegram_otp_codes', function (table) {
    table
      .string('id', 24)
      .defaultTo(knex.raw('generate_object_id()'))
      .primary();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('expires_at').notNullable();
    table.boolean('is_deleted').defaultTo(false).notNullable();

    table.string('username', 100).notNullable();
    table.string('code', 255).notNullable(); // Hashed OTP code
    table.boolean('is_used').defaultTo(false).notNullable();
    table.integer('attempts').defaultTo(0).notNullable();

    // Index for faster lookups
    table.index(['username', 'is_deleted']);
    table.index(['expires_at']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('telegram_otp_codes');
}
