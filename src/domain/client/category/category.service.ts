import { Injectable } from '@nestjs/common';
import { CategoryRepo, SubCategoryRepo } from './category.repo';
import { ListPageDto } from 'src/shared/dto/list.dto';
import { SubcategoryListPageDto } from 'src/domain/admin/dto/category-admin.dto';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepo: CategoryRepo,
    private readonly subcategoryRepo: SubCategoryRepo,
  ) {}

  findAll() {
    return this.categoryRepo.select({ is_deleted: false }, { limit: 10 });
  }

  findOne(id: string) {
    return this.categoryRepo.selectById(id);
  }

  async getCategoryList(params: ListPageDto) {
    return this.categoryRepo.getCategoryList(params);
  }

  async getSubcategoryList(params: SubcategoryListPageDto) {
    return this.subcategoryRepo.getSubcategoryList(params);
  }
}
