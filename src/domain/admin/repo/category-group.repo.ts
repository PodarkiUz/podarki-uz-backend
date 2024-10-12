import { BaseRepo } from '@shared/providers/base-dao';
import { Injectable } from '@nestjs/common';
import { CategoryGroupEntity } from '../entity/category-group.entity';

@Injectable()
export class CategoryGroupRepo extends BaseRepo<CategoryGroupEntity> {
  constructor() {
    super('category_group');
  }

  getAllCategoryGroupList() {
    return this.getAll({ is_deleted: false });
  }
}
