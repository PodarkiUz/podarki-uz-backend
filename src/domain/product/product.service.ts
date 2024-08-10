import { Injectable } from '@nestjs/common';
import { ProductListByCategoryDto, SearchDto } from './dto/product.dto';
import { ProductRepo } from './product.repo';
import { IUser } from '../user/interface/user.interface';
import {
  ProductNotFoundException,
  UserHasNotOwnerPermissionException,
} from 'src/errors/permission.error';
import { isEmpty } from 'lodash';
import { AdsRepo } from './ads.repo';
import { ListPageDto } from 'src/shared/dto/list.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepo: ProductRepo,
    private readonly adsRepo: AdsRepo,
  ) { }

  getUserProducts(params: ListPageDto, user: IUser) {
    return this.productRepo.select(
      { is_deleted: false, owner_id: user.id },
      { limit: params?.page, offset: params?.page },
    );
  }

  listByCategory(params: ProductListByCategoryDto, user: IUser) {
    return this.productRepo.listByCategory(params, user);
  }

  getLastProducts() {
    return this.productRepo.select(
      { is_deleted: false },
      {
        limit: 10,
        order_by: { column: 'created_at', order: 'asc', use: true },
      },
    );
  }

  findOne(id: string) {
    return this.productRepo.selectById(id);
  }

  async delete(id: string, user: IUser) {
    const product = await this.productRepo.selectById(id);

    if (isEmpty(product)) {
      throw new ProductNotFoundException();
    }

    if (product.owner_id !== user.id) {
      throw new UserHasNotOwnerPermissionException();
    }

    await this.productRepo.softDelete(id);

    return { success: true };
  }

  async searchProductByName(params: SearchDto) {
    return this.productRepo.searchProductByName(params);
  }

  async getlastAds() {
    return this.adsRepo.getLastAds();
  }
}
