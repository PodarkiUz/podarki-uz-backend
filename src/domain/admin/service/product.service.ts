import { Injectable } from '@nestjs/common';
import { SetProductStatusDto } from '../dto/product-admin.dto';
import { AdminProductRepo } from '../repo/product.repo';
import { isEmpty } from 'lodash';
import {
  CategoryNotFoundException,
  ProductNotFoundException,
} from 'src/errors/permission.error';
import { OrdersRepo } from 'src/domain/orders/orders.repo';
import { OrderListDto } from 'src/domain/orders/dto/order.dto';
import { ListPageDto } from 'src/shared/dto/list.dto';
import {
  CreateProductByAdminDto,
  UpdateProductByAdminDto,
} from 'src/domain/product/dto/product.dto';
import { AdminCategoryRepo, AdminSubcategoryRepo } from '../repo/category.repo';

@Injectable()
export class AdminProductService {
  constructor(
    private readonly adminProductRepo: AdminProductRepo,
    private readonly adminSubcategoryRepo: AdminSubcategoryRepo,
    private readonly orderRepo: OrdersRepo,
  ) {}

  async create(params: CreateProductByAdminDto) {
    const category = await this.adminProductRepo.selectById(
      params.sub_category_id,
    );

    if (isEmpty(category)) {
      throw new CategoryNotFoundException();
    }

    return this.adminProductRepo.insert({
      name_uz: params.name_uz,
      name_ru: params.name_ru,
      name_lat: params.name_en,
      sub_category_id: params.sub_category_id,
      avif_images: params.avif_images,
      small_image: params.small_image,
      price: params.price,
      discount_price: params.discount_price,
      description: params?.description,
      shop_id: params.shop_id,
    });
  }

  setStatus(params: SetProductStatusDto) {
    return this.adminProductRepo.updateById(params.product_id, {
      status: params.status,
    });
  }

  findAll(params: ListPageDto) {
    return this.adminProductRepo.select(
      {
        is_deleted: false,
      },
      {
        limit: params.per_page,
        offset: params.page,
        order_by: { column: 'created_at', order: 'desc', use: true },
      },
    );
  }

  async delete(id: string) {
    const product = await this.adminProductRepo.selectById(id);

    if (isEmpty(product)) {
      throw new ProductNotFoundException();
    }

    await this.adminProductRepo.softDelete(id);

    return { success: true };
  }

  async update(params: UpdateProductByAdminDto) {
    const product = await this.adminProductRepo.selectById(params.id);

    if (isEmpty(product)) {
      throw new ProductNotFoundException();
    }

    return await this.adminProductRepo.updateById(params.id, {
      name_uz: params.name_uz,
      name_ru: params.name_ru,
      name_lat: params.name_en,
      sub_category_id: params.sub_category_id,
      avif_images: params.avif_images,
      small_image: params.small_image,
      price: params.price,
      discount_price: params.discount_price,
      description: params?.description,
      shop_id: params.shop_id,
    });
  }

  async orderList(params: OrderListDto) {
    return await this.orderRepo.select(
      {
        status: Number(params.status),
        is_deleted: false,
      },
      {
        limit: params.per_page,
        offset: params.page,
        order_by: { column: 'created_at', order: 'desc', use: true },
      },
    );
  }
}
