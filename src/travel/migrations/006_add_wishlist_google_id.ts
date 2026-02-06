import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const hasTable = await knex.schema.hasTable('wishlist_users');
  if (!hasTable) return;

  return knex.schema.alterTable('wishlist_users', (table) => {
    table.string('google_id', 64).unique().nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  const hasTable = await knex.schema.hasTable('wishlist_users');
  if (!hasTable) return;

  return knex.schema.alterTable('wishlist_users', (table) => {
    table.dropColumn('google_id');
  });
}
