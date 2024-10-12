import { BaseRepo } from '@shared/providers/base-dao';
import { CategoryEntity } from '../entity/category.entity';
import { Injectable } from '@nestjs/common';
import { Knex } from 'nestjs-knex';

@Injectable()
export class CategoryRepo extends BaseRepo<CategoryEntity> {
  constructor() {
    super('category');
  }

  getAllCategoryList() {
    return this.getAll({ is_deleted: false });
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
}
