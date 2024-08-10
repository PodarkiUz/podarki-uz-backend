import { Injectable } from '@nestjs/common';
import { SubcategoryListPageDto } from 'src/domain/admin/dto/category-admin.dto';
import { BaseRepo } from 'src/providers/base-dao';
import { ListPageDto } from 'src/shared/dto/list.dto';

@Injectable()
export class CategoryRepo extends BaseRepo<any> {
  constructor() {
    super('category');
  }

  async getCategoryList(params: ListPageDto) {
    const query = this.knex
      .select(['*'])
      .from(this._tableName)
      .where('is_deleted', false);

    return this.paginatedSelect(query, params?.page, params?.per_page);
  }
}

@Injectable()
export class SubCategoryRepo extends BaseRepo<any> {
  constructor() {
    super('sub_category');
  }

  async getSubcategoryList(params: SubcategoryListPageDto) {
    const knex = this.knexService.instance;

    const query = knex
      .select(['*'])
      .from(this._tableName)
      .where('category_id', params.category_id)
      .where('is_deleted', false);

    return this.paginatedSelect(query, params?.page, params?.per_page);
  }
}
