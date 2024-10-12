import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ICreateCategoryParam,
  IUpdateCategoryParam,
} from '../interface/category.interface';
import { CategoryRepo } from '../repo/category.repo';
import { isEmpty } from 'lodash';
import { CategoryGroupRepo } from '../repo/category-group.repo';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepo: CategoryRepo,
    private readonly categoryGroupRepo: CategoryGroupRepo,
  ) { }

  async create(params: ICreateCategoryParam) {
    const categoryId = this.categoryRepo.generateRecordId();
    let categoryParentHierarchy = categoryId;

    if (params?.group_id && params?.parent_id) {
      throw new BadRequestException(
        'GROUP CANNOT BE ADDED ON CHILD CATEGORIES!',
      );
    }

    if (params?.parent_id) {
      const parentCategory = await this.categoryRepo.getById(params.parent_id);

      if (isEmpty(parentCategory)) {
        throw new NotFoundException('PARENT CATEGORY NOT FOUND');
      }

      categoryParentHierarchy = `${parentCategory.parent_hierarchy}.${categoryId}`;
    }

    if (params?.group_id) {
      const hasGroup = await this.categoryGroupRepo.getById(params.group_id);

      if (isEmpty(hasGroup)) {
        throw new NotFoundException('CATEGORY GROUP NOT FOUND');
      }
    }

    const category = await this.categoryRepo.insert({
      ...params,
      id: categoryId,
      parent_hierarchy: categoryParentHierarchy,
    });

    return { success: true, data: category };
  }

  async delete(id: string) {
    await this.categoryRepo.updateById(id, { is_deleted: true });
    return { success: true };
  }

  async update(id: string, params: IUpdateCategoryParam) {
    return this.categoryRepo.updateById(id, params);
  }

  async getAllList() {
    const data = await this.categoryRepo.getAllCategoryList();
    return { success: true, data };
  }
}
