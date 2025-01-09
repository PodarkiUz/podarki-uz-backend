import { Injectable } from '@nestjs/common';
import { ShopRepo } from '../repo/shop.repo';
import { IShopCreateParam, IShopUpdateParam } from '../interface/shop.interface';
import { ICurrentUser } from '@shared/interfaces/current-user';
import { ShopStatus } from '../shop.enum';

@Injectable()
export class ShopService {
  constructor(private readonly shopRepo: ShopRepo) { }

  async create(params: IShopCreateParam, currentUser: ICurrentUser) {
    const shop = await this.shopRepo.insert({
      owner_user_id: currentUser.id,
      status: ShopStatus.Registered,
      description_ru: params?.description_ru,
      description_uz: params?.description_uz,
      name: params.name,
      banner_image: params?.banner_image,
      image: params.image,
    });

    return { success: true, data: shop };
  }

  async delete(id: string) {
    await this.shopRepo.updateById(id, { is_deleted: true });
    return { success: true };
  }

  async update(id: string, params: IShopUpdateParam) {
    return this.shopRepo.updateById(id, params);
  }

  async getAllList() {
    const data = await this.shopRepo.getAllShops();
    return data;
  }
}
