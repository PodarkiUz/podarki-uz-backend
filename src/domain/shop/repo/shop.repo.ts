import { BaseRepo } from '@shared/providers/base-dao';
import { Injectable } from '@nestjs/common';
import { ShopEntity } from '../entity/shop.entity';
import { IShopUserInfoForJwtPayload } from '../interface/shop.interface';

@Injectable()
export class ShopRepo extends BaseRepo<ShopEntity> {
  constructor() {
    super('shops');
  }

  getAllShops() {
    return this.getAll({ is_deleted: false });
  }

  getShopByUsername(name: string) {
    const shop = this.knex
      .select('*')
      .from(this.tableName)
      .where('name', name)
      .whereNot('is_deleted', true)
      .first();

    return shop;
  }

  getShopByOwnerPhone(phone): Promise<ShopEntity> {
    const knex = this.knex;
    const query = knex
      .select(['shop.*'])
      .from(`${this.tableName} as shop`)
      .join('users as user', function () {
        this.on('shop.owner_user_id', 'user.id').andOn(
          knex.raw('"user".is_deleted = false'),
        );
      })
      .where('user.phone', phone)
      .where('shop.is_deleted', false)
      .first();

    return query;
  }

  getShopByOwnerUserId(id: string) {
    const shop = this.knex
      .select('*')
      .from(this.tableName)
      .where('owner_user_id', id)
      .where('is_deleted', false)
      .first();

    return shop;
  }

  getShopForJwtPayloadById(
    owner_user_id: string,
  ): Promise<IShopUserInfoForJwtPayload> {
    const knex = this.knex;
    const shop = knex
      .select([
        'shop.id as shop_id',
        'shop.owner_user_id',
        'user.phone as user_phone',
        'shop.name as shop_name',
        'user.first_name as user_first_name',
        'user.last_name as user_last_name',
        'shop.status as shop_status',
      ])
      .from(`${this.tableName} as shop`)
      .join('users as user', function () {
        this.on('shop.owner_user_id', 'user.id').andOn(
          knex.raw('"user".is_deleted = false'),
        );
      })
      .where('shop.owner_user_id', owner_user_id)
      .where('shop.is_deleted', false)
      .first();

    return shop;
  }
}
