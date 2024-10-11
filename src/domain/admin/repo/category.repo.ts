import { BaseRepo } from '@shared/providers/base-dao';
import { CategoryEntity } from '../entity/category.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoryRepo extends BaseRepo<CategoryEntity> {
  constructor() {
    super('category');
  }

  getAllCategoryList() {
    return this.getAll({ is_deleted: false });
  }
}
