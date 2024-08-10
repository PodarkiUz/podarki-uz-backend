import { Injectable, NotFoundException } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { ShopLoginDto } from '../dto/shop.dto';
import { verifyPassword } from 'src/shared/utils/password-hash';
import { AdminShopRepo } from 'src/domain/admin/repo/shop.repo';
import {
  CategoryNotFoundException,
  ProductNotFoundException,
  ShopLoginIncorrectException,
  ShopPasswordIncorrectException,
  UserIsNotOwnerPermissionException,
} from 'src/errors/permission.error';
import { JwtService } from '@nestjs/jwt';
import { UpdateShopByCabinetDto } from 'src/domain/admin/dto/shop.dto';
import { ICurrentShop } from '../interface/shop.interface';
import { AdminSubcategoryRepo } from 'src/domain/admin/repo/category.repo';
import {
  CreateProductByShopDto,
  UpdateProductByShopDto,
} from 'src/domain/client/product/dto/product.dto';
import { AdminProductRepo } from 'src/domain/admin/repo/product.repo';
import { ListPageDto } from 'src/shared/dto/list.dto';
import { CabinetProductListDto } from '../dto/product.dto';

@Injectable()
export class CabinetShopService {
  constructor(
    private readonly adminShopRepo: AdminShopRepo,
    private readonly adminSubcategoryRepo: AdminSubcategoryRepo,
    private readonly adminProductRepo: AdminProductRepo,
    private readonly jwtService: JwtService,
  ) { }

  async login(params: ShopLoginDto) {
    const shop = await this.adminShopRepo.selectByLogin(params.login);

    if (isEmpty(shop)) {
      throw new ShopLoginIncorrectException();
    }

    const isPasswordValid = await verifyPassword(
      params.password,
      shop.password,
    );

    if (!isPasswordValid) {
      throw new ShopPasswordIncorrectException();
    }

    return {
      access_token: await this.jwtService.signAsync(
        {
          id: shop.id,
          name: shop.name,
          // avif_image: shop.avif_image,
          // small_image: shop.small_image,
          // description: shop.description,
        },
        { privateKey: 'podarkiuz-app' },
      ),
    };
  }

  async update(params: UpdateShopByCabinetDto, currentShop: ICurrentShop) {
    const shop = await this.adminShopRepo.selectById(currentShop.id);

    if (isEmpty(shop)) {
      throw new NotFoundException();
    }

    return this.adminShopRepo.updateById(currentShop.id, {
      name: params?.name,
      description: params?.description,
      avif_image: params?.avif_image,
      small_image: params?.small_image,
    });
  }

  async createProduct(
    params: CreateProductByShopDto,
    currentShop: ICurrentShop,
  ) {
    const category = await this.adminSubcategoryRepo.selectById(
      params.sub_category_id,
    );

    if (isEmpty(category)) {
      throw new CategoryNotFoundException();
    }

    return this.adminShopRepo.insert({
      name_uz: params.name_uz,
      name_ru: params.name_ru,
      name_lat: params.name_en,
      sub_category_id: params.sub_category_id,
      avif_images: params.avif_images,
      small_image: params.small_image,
      price: params.price,
      discount_price: params.discount_price,
      description: params?.description,
      shop_id: currentShop.id,
    });
  }

  async updateProduct(
    params: UpdateProductByShopDto,
    currentShop: ICurrentShop,
  ) {
    const product = await this.adminProductRepo.selectById(params.id);

    if (isEmpty(product)) {
      throw new ProductNotFoundException();
    }

    if (product.shop_id !== currentShop.id) {
      throw new UserIsNotOwnerPermissionException();
    }

    if (params?.sub_category_id) {
      const category = await this.adminSubcategoryRepo.selectById(
        params?.sub_category_id,
      );

      if (isEmpty(category)) {
        throw new CategoryNotFoundException();
      }
    }

    return this.adminShopRepo.insert({
      name_uz: params?.name_uz,
      name_ru: params?.name_ru,
      name_lat: params?.name_en,
      sub_category_id: params?.sub_category_id,
      avif_images: params?.avif_images,
      small_image: params?.small_image,
      price: params?.price,
      discount_price: params?.discount_price,
      description: params?.description,
    });
  }

  productList(params: CabinetProductListDto, currentShop: ICurrentShop) {
    return this.adminProductRepo.shopProductList(params, currentShop);
  }
}
