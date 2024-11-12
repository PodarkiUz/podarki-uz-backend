import { Injectable } from '@nestjs/common';
import { ProductRepo } from '../repo/product.repo';
import {
  ICreateProductFilterParam,
  ICreateProductParam,
  IUpdateProductParam,
} from '../interface/product.interface';
import { ProductFiltersRepo } from '../repo/filters.repo';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productRepo: ProductRepo,
    private readonly productFilterRepo: ProductFiltersRepo,
  ) {}

  async create(params: ICreateProductParam) {
    const product = await this.productRepo.insert({
      ...params,
      files: JSON.stringify(params.files),
    });

    return { success: true, data: product };
  }

  async delete(id: string) {
    await this.productRepo.updateById(id, { is_deleted: true });
    return { success: true };
  }

  async update(id: string, params: IUpdateProductParam) {
    return this.productRepo.updateById(id, params);
  }

  async getAllList() {
    const data = await this.productRepo.getAllProducts();
    return data;
  }

  async addProductFilter(params: ICreateProductFilterParam) {
    const productFilter = await this.productFilterRepo.insert(params);
    return { success: true, data: productFilter };
  }

  async getProductsByIdea(idea_id: string) {
    return this.productRepo.getProductsByIdea(idea_id);
  }

  async getProductsByCategory(category_id: string) {
    return this.getProductsByCategory(category_id);
  }
}
