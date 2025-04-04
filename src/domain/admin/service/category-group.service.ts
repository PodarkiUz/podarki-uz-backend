import { Injectable } from '@nestjs/common';
import { CategoryGroupRepo } from '../repo/category-group.repo';
import {
  ICreateCategoryGroupParam,
  IUpdateCategoryGroupParam,
} from '../interface/category-group.interface';
import { CategoryRepo } from '../repo/category.repo';
import { isEmpty } from 'lodash';
import { CategoryGroupHasCategoriesException } from '@shared/errors/permission.error';

@Injectable()
export class CategoryGroupService {
  constructor(
    private readonly categoryGroupRepo: CategoryGroupRepo,
    private readonly categoryRepo: CategoryRepo,
  ) {}

  async create(params: ICreateCategoryGroupParam) {
    const categoryGroup = await this.categoryGroupRepo.insert(params);

    return { success: true, data: categoryGroup };
  }

  async delete(id: string) {
    const childCategories = await this.categoryRepo.getCategoryGroupCategories(
      id,
    );

    if (!isEmpty(childCategories)) {
      throw new CategoryGroupHasCategoriesException();
    }

    await this.categoryGroupRepo.updateById(id, { is_deleted: true });
    return { success: true };
  }

  async update(id: string, params: IUpdateCategoryGroupParam) {
    return this.categoryGroupRepo.updateById(id, params);
  }

  async getAllList() {
    const data = await this.categoryGroupRepo.getAllCategoryGroupList();
    return { success: true, data };
  }
}
