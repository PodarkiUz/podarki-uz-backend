import { BaseRepo } from '@shared/providers/base-dao';
import { Injectable } from '@nestjs/common';
import { IShopUserInfoForJwtPayload } from '../../admin/interface/admin.interface';
import { OrganizerEntity } from './entity';
import { FileDependentType } from '../enums';

@Injectable()
export class OrganizerRepo extends BaseRepo<OrganizerEntity> {
  constructor() {
    super('organizers');
  }

  getAllOrganizers() {
    const knex = this.knex;
    const query = knex
      .select([
        'org.*',
        knex.raw('count(org.id) over() as total'),
        knex.raw(
          `jsonb_agg(
              jsonb_build_object(
                'url', file.url,
                'type', file.type
              )
            ) FILTER (WHERE file.id is not null) AS files`,
        ),
      ])
      .from(`${this.tableName} as org`)
      .leftJoin('files as file', function () {
        this.on('file.dependent_id', 'org.id').andOn(
          knex.raw('file.depend = ?', FileDependentType.organizer),
        );
      })
      .where('org.is_deleted', false)
      .groupBy('org.id');

    return query;
  }

  getOrganizerByName(name: string) {
    const row = this.knex
      .select('*')
      .from(this.tableName)
      .whereILike('name', name)
      .whereNot('is_deleted', true)
      .first();

    return row;
  }

  getOrganizerByOwnerPhone(phone): Promise<OrganizerEntity> {
    const knex = this.knex;
    const query = knex
      .select(['o.*'])
      .from(`${this.tableName} as o`)
      .where('o.phone', phone)
      .where('o.is_deleted', false)
      .first();

    return query;
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
