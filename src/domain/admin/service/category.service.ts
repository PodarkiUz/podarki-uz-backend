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
import { ListPageDto } from '@shared/dto/list.dto';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepo: CategoryRepo,
    private readonly categoryGroupRepo: CategoryGroupRepo,
  ) {}

  async create(params: ICreateCategoryParam) {
    const categoryId = this.categoryRepo.generateRecordId(); // Generate a new category ID
    let categoryParentHierarchy: string | null = null;

    // Validation: Prevent group_id and parent_id in the same request
    if (params.group_id && params.parent_id) {
      throw new BadRequestException(
        'GROUP CANNOT BE ADDED ON CHILD CATEGORIES!',
      );
    }

    // If parent_id is provided, validate and build the hierarchy
    if (params?.parent_id) {
      const parentCategory = await this.categoryRepo.getById(params.parent_id);

      if (!parentCategory) {
        throw new NotFoundException('PARENT CATEGORY NOT FOUND');
      }

      // Construct the new hierarchy as parentHierarchy.childId
      categoryParentHierarchy = `${parentCategory.parent_hierarchy}.${categoryId}`;
    }

    if (params?.group_id) {
      const hasGroup = await this.categoryGroupRepo.getById(params.group_id);

      if (!hasGroup) {
        throw new NotFoundException('CATEGORY GROUP NOT FOUND');
      }
    }

    // Insert the new category with the constructed or null hierarchy
    const category = await this.categoryRepo.insert({
      ...params,
      id: categoryId,
      parent_hierarchy: categoryParentHierarchy || `${categoryId}`, // Use categoryId as root hierarchy if no parent
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
    return data;
  }

  async getChildCategoriesList(category_id: string) {
    const data = await this.categoryRepo.getChildCategories(category_id);
    return { success: true, data };
  }

  async getParentCategories() {
    const data = await this.categoryRepo.getParentCategories();
    return { success: true, data };
  }
}
