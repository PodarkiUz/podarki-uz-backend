import { Injectable } from '@nestjs/common';
import { CategoryRepo } from './category.repo';
import { ListPageDto } from 'src/shared/dto/list.dto';
import { SubcategoryListPageDto } from 'src/domain/admin/dto/category-admin.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepo: CategoryRepo) {}

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
    return this.categoryRepo.getSubcategoryList(params);
  }
}
