import { Knex } from 'knex';

export async function up(mainKnex: Knex): Promise<void> {
  return mainKnex.transaction((knex) => {
    return (
      knex.schema
        // Create reasons table
        .createTable('reasons', function (table) {
          table
            .string('id', 24)
            .defaultTo(knex.raw('generate_object_id()'))
            .primary();
          table.text('description');
          table.text('image');
          table.string('title', 255).notNullable();
        })

        // Create idea_group table
        .createTable('idea_group', function (table) {
          table
            .string('id', 24)
            .defaultTo(knex.raw('generate_object_id()'))
            .primary();
          table.string('title', 255).notNullable();
        })

        // Create idea table
        .createTable('idea', function (table) {
          table
            .string('id', 24)
            .defaultTo(knex.raw('generate_object_id()'))
            .primary();
          table.text('description');
          table.text('image');
          table.string('title', 255).notNullable();
          table
            .string('idea_group_id', 24)
            .references('id')
            .inTable('idea_group');
        })

        // Create catalog table
        .createTable('catalog', function (table) {
          table
            .string('id', 24)
            .defaultTo(knex.raw('generate_object_id()'))
            .primary();
          table.string('title', 255).notNullable();
        })

        // Create product table
        .createTable('product', function (table) {
          table
            .string('id', 24)
            .defaultTo(knex.raw('generate_object_id()'))
            .primary();
          table.text('description');
          table.text('image');
          table.string('title', 255).notNullable();
          table.decimal('price', 10, 2).notNullable();
          table.string('catalog_id', 24).references('id').inTable('catalog');
        })

        // Create junction table for reasons and idea_group
        .createTable('reason_idea_group', function (table) {
          table.string('reason_id', 24).references('id').inTable('reasons');
          table
            .string('idea_group_id', 24)
            .references('id')
            .inTable('idea_group');
          table.primary(['reason_id', 'idea_group_id']);
        })

        // Create junction table for idea and catalog
        .createTable('idea_catalog', function (table) {
          table.string('idea_id', 24).references('id').inTable('idea');
          table.string('catalog_id', 24).references('id').inTable('catalog');
          table.primary(['idea_id', 'catalog_id']);
        })
    );
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTableIfExists('idea_catalog')
    .dropTableIfExists('reason_idea_group')
    .dropTableIfExists('product')
    .dropTableIfExists('catalog')
    .dropTableIfExists('idea')
    .dropTableIfExists('idea_group')
    .dropTableIfExists('reasons');
}
