import { Injectable, NotFoundException } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { ShopLoginDto } from '../dto/shop.dto';
import { verifyPassword } from 'src/shared/utils/password-hash';
import { AdminShopRepo } from 'src/domain/admin/repo/shop.repo';
import {
  ShopLoginIncorrectException,
  ShopPasswordIncorrectException,
} from 'src/errors/permission.error';
import { JwtService } from '@nestjs/jwt';
import { UpdateShopByCabinetDto } from 'src/domain/admin/dto/shop.dto';
import { ICurrentShop } from '../interface/shop.interface';

@Injectable()
export class CabinetShopService {
  constructor(
    private readonly adminShopRepo: AdminShopRepo,
    private readonly jwtService: JwtService,
  ) {}

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
}
