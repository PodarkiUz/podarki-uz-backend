import { BaseRepo } from '@shared/providers/base-dao';
import { CategoryEntity } from '../entity/category.entity';
import { Injectable } from '@nestjs/common';
import { Knex } from 'nestjs-knex';

@Injectable()
export class CategoryRepo extends BaseRepo<CategoryEntity> {
  constructor() {
    super('category');
  }

  async getAllCategoryList() {
    const knex: Knex = this.knex;

    const query = knex
      .select([knex.raw(`jsonb_agg(get_category_tree(c.id)) AS category_tree`)])
      .from(`${this.tableName} as c`)
      .where('c.is_deleted', false)
      .where('c.parent_id', null);

    // Extract the JSON result from the query
    return (await query)[0].category_tree;
  }

  getChildCategories(category_id: string) {
    const knex: Knex = this.knex;

    return knex
      .select(['*'])
      .from(this.tableName)
      .whereRaw(`parent_hierarchy <@ '${category_id}'`)
      .where('is_deleted', false);
  }

  getParentCategories() {
    return this.getAll({ parent_id: null, is_deleted: false });
  }

  getCategoryGroupCategories(category_group_id: string) {
    const knex: Knex = this.knex;

    return knex
      .select(['id'])
      .from(this.tableName)
      .where('group_id', category_group_id)
      .where('is_deleted', false);
  }
}
