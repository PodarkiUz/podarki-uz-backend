import { Injectable, NotFoundException } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { ListPageDto } from 'src/shared/dto/list.dto';
import { AdminShopRepo } from '../repo/shop.repo';
import {
  AdminShopListDto,
  CreateShopDto,
  UpdateShopDto,
} from '../dto/shop.dto';
import { createHashPassword } from 'src/shared/utils/password-hash';

@Injectable()
export class AdminShopService {
  constructor(private readonly adminShopRepo: AdminShopRepo) {}

  async create(params: CreateShopDto) {
    return this.adminShopRepo.insert({
      name: params.name,
      description: params?.description,
      avif_image: params.avif_image,
      small_image: params.small_image,
      password: await createHashPassword(params.password),
      login: params.login,
    });
  }

  async update(params: UpdateShopDto) {
    const shop = await this.adminShopRepo.selectById(params.id);

    if (isEmpty(shop)) {
      throw new NotFoundException();
    }

    return this.adminShopRepo.updateById(params.id, {
      name: params?.name,
      description: params?.description,
      avif_image: params?.avif_image,
      small_image: params?.small_image,
    });
  }

  async getAllShops(params: AdminShopListDto) {
    return this.adminShopRepo.getAllShops(params);
  }
}
