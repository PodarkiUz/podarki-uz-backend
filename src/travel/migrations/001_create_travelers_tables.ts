import { Knex } from 'knex';

export async function up(mainKnex: Knex): Promise<void> {
  return mainKnex.transaction((knex) => {
    return (
      knex.schema
        // Create travelers table
        .createTable('travelers', function (table) {
          table
            .string('id', 24)
            .defaultTo(knex.raw('generate_object_id()'))
            .primary();
          table.timestamp('created_at').defaultTo(knex.fn.now());
          table.timestamp('updated_at').defaultTo(knex.fn.now());
          table.boolean('is_deleted').defaultTo(false).notNullable();

          // Basic user information
          table.string('first_name', 255);
          table.string('last_name', 255);
          table.string('email', 255);
          table.string('phone_number', 20).notNullable().unique();

          // Authentication fields
          table.string('password_hash', 255); // For phone number authentication
          table.string('google_id', 255); // Google OAuth ID
          table.string('google_email', 255); // Google email (may differ from main email)

          // Profile information
          table.text('avatar_url');
          table.date('date_of_birth');
          table.enum('gender', ['male', 'female', 'other']);
          table.string('nationality', 100);
          table.string('passport_number', 50);

          // Verification and status
          table.boolean('is_phone_verified').defaultTo(false).notNullable();
          table.boolean('is_email_verified').defaultTo(false).notNullable();
          table.boolean('is_active').defaultTo(true).notNullable();
          table.timestamp('last_login_at');

          // Preferences
          table.string('preferred_language', 10).defaultTo('uz').notNullable();
          table.string('timezone', 50).defaultTo('Asia/Tashkent').notNullable();

          // Location
          table.string('current_location', 255);
          table.string('home_country', 100);
          table.string('home_city', 100);
        })

        // Create phone verification codes table
        .createTable('phone_verification_codes', function (table) {
          table
            .string('id', 24)
            .defaultTo(knex.raw('generate_object_id()'))
            .primary();
          table.timestamp('created_at').defaultTo(knex.fn.now());
          table.timestamp('expires_at').notNullable();
          table.boolean('is_deleted').defaultTo(false).notNullable();

          table.string('phone_number', 20).notNullable();
          table.string('code', 6).notNullable();
          table.boolean('is_used').defaultTo(false).notNullable();
          table.integer('attempts').defaultTo(0).notNullable();
        })

        // Create traveler sessions table
        .createTable('traveler_sessions', function (table) {
          table
            .string('id', 24)
            .defaultTo(knex.raw('generate_object_id()'))
            .primary();
          table.timestamp('created_at').defaultTo(knex.fn.now());
          table.timestamp('expires_at').notNullable();
          table.boolean('is_deleted').defaultTo(false).notNullable();

          table
            .string('traveler_id', 24)
            .references('id')
            .inTable('travelers')
            .onDelete('cascade')
            .notNullable();
          table.text('access_token').notNullable();
          table.text('refresh_token');
          table.jsonb('device_info');
          table.string('ip_address', 45);
        })
    );
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTableIfExists('traveler_sessions')
    .dropTableIfExists('phone_verification_codes')
    .dropTableIfExists('travelers');
} 