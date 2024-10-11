import { Injectable } from '@nestjs/common';
import { ICreateCategoryParam } from '../interface/category.interface';
import { CategoryRepo } from '../repo/category.repo';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepo: CategoryRepo) { }

  async create(params: ICreateCategoryParam) {
    const category = await this.categoryRepo.insert(params);

    return { success: true, data: category };
  }

  async delete(id: string) {
    await this.categoryRepo.updateById(id, { is_deleted: true });
    return { success: true };
  }

  async getAllList() {
    const data = await this.categoryRepo.getAllCategoryList();
    return { success: true, data };
  }
}
