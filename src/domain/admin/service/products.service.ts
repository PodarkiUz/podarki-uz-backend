import { Injectable } from '@nestjs/common';
import { ProductRepo } from '../repo/product.repo';
import {
  ICreateProductFilterParam,
  ICreateProductParam,
  IUpdateProductParam,
} from '../interface/product.interface';
import { ProductFiltersRepo } from '../repo/filters.repo';
import { IShopUserInfoForJwtPayload } from '@domain/shop/interface/shop.interface';
import { isEmpty } from 'lodash';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productRepo: ProductRepo,
    private readonly productFilterRepo: ProductFiltersRepo,
  ) {}

  async create(
    params: ICreateProductParam,
    currentUser: IShopUserInfoForJwtPayload,
  ) {
    return this.productRepo.knex.transaction(async (trx) => {
      const product = await this.productRepo.insertWithTransaction(trx, {
        name_ru: params.name_ru,
        name_uz: params.name_uz,
        price: params.price,
        sale_price: params?.sale_price,
        category_id: params?.category_id,
        description_ru: params?.description_ru,
        description_uz: params?.description_uz,
        shop_id: currentUser.shop_id,
        files: JSON.stringify(params.files),
      });

      if (!isEmpty(params?.filters)) {
        const filters: ICreateProductFilterParam[] = [];

        for (const f of params.filters) {
          for (const v of f.values) {
            filters.push({ filter_value_id: v, product_id: product.id });
          }
        }

        await this.productFilterRepo.bulkInsertWithTransaction(trx, filters);
      }

      return { success: true, data: product };
    });
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
