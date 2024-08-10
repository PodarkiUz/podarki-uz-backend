import { Injectable } from '@nestjs/common';
import { BaseRepo } from 'src/providers/base-dao';
import { ListPageDto } from 'src/shared/dto/list.dto';

@Injectable()
export class AdminCategoryRepo extends BaseRepo<any> {
  constructor() {
    super('category');
  }

  getAllCategories(params: ListPageDto) {
    const query = this.knex.select('*').from(this._tableName);

    return this.paginatedSelect(query, params?.page, params?.per_page);
  }
}

@Injectable()
export class AdminSubcategoryRepo extends BaseRepo<any> {
  constructor() {
    super('sub_category');
  }

  getAllSubcategories(params: ListPageDto) {
    const query = this.knex.select('*').from(this._tableName);

    return this.paginatedSelect(query, params?.page, params?.per_page);
  }
}
