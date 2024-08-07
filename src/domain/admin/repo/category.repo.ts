import { Injectable } from '@nestjs/common';
import { BaseRepo } from 'src/providers/base-dao';

@Injectable()
export class AdminCategoryRepo extends BaseRepo<any> {
  constructor() {
    super('category');
  }
}

@Injectable()
export class AdminSubcategoryRepo extends BaseRepo<any> {
  constructor() {
    super('sub_category');
  }
}
