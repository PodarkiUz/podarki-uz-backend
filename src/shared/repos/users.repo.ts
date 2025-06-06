import { Injectable } from '@nestjs/common';
import { BaseRepo } from '@shared/providers/base-dao';
import { tableNames, users } from '@shared/constants/tableNames';

@Injectable()
export class UsersRepo extends BaseRepo<any> {
  constructor() {
    super(users.name);
  }

  async getUserInfo(user_id: any, trx?) {
    const knex = trx || this.knex;
    const query = knex
      .select([
        'u.id',
        'u.username',
        'u.is_active',
        'u.first_name',
        'u.last_name',
        'u.middle_name',
        'u.is_verified',
        this._knex.raw(
          `jsonb_agg(r.role_name) filter (where r.role_name is not null) as roles`,
        ),
        this._knex.raw(
          `jsonb_agg(p.permission_name) filter (where p.permission_name is not null) as permissions`,
        ),
        this._knex.raw(
          `jsonb_agg(pu.provider_id) filter (where pu.provider_id is not null) as providers`,
        ),
        this._knex.raw(`case when reg.id is not null then jsonb_build_object(
          'id', reg.id,
          'name_uz', reg.name_uz,
          'name_ru', reg.name_ru,
          'name_uzl', reg.name_uz_latn
        ) end as region`),
      ])
      .from(`${this.tableName} as u`)
      .leftJoin(`${tableNames.regions} as reg`, 'u.region_id', 'reg.id')
      .leftJoin(`${tableNames.user_roles} as ur`, 'ur.user_id', 'u.id')
      .leftJoin(`${tableNames.roles} as r`, 'r.id', 'ur.role_id')
      .leftJoin(`${tableNames.role_permissions} as rp`, 'rp.role_id', 'r.id')
      .leftJoin(`${tableNames.permissions} as p`, 'p.id', 'rp.permission_id')
      .leftJoin(`${tableNames.provider_users} as pu`, 'pu.user_id', 'u.id')
      .where('u.id', user_id)
      .groupBy(['u.id', 'reg.id'])
      .first();

    return query;
  }
}
