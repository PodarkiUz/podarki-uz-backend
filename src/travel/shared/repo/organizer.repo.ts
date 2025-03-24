import { BaseRepo } from '@shared/providers/base-dao';
import { Injectable } from '@nestjs/common';
import { IShopUserInfoForJwtPayload } from '../../admin/interface/admin.interface';
import { OrganizerEntity } from './entity';
import { FileDependentType } from '../enums';
import { ILanguage, PaginationParams } from '../interfaces';
import { isEmpty } from 'lodash';

@Injectable()
export class OrganizerRepo extends BaseRepo<OrganizerEntity> {
  constructor() {
    super('organizers');
  }

  getAllOrganizers(params: PaginationParams) {
    const knex = this.knex;
    const { offset = 0, limit = 10 } = params;
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

    if (!isEmpty(params?.search)) {
      query.whereRaw(`(
        org.title ->> 'ru' ilike '%${params.search}%'
        or org.title ->> 'en' ilike '%${params.search}%'
        or org.title ->> 'uz' ilike '%${params.search}%'
        )`);
    }

    if (limit) {
      query.limit(limit);
      if (offset) {
        query.offset(offset);
      }
    }

    return query;
  }

  getAllOrganizersClient(params: PaginationParams, lang: ILanguage) {
    const knex = this.knex;
    const { offset = 0, limit = 10 } = params;
    const query = knex
      .select([
        'org.*',
        knex.raw(`org.title -> '${lang}' as title`),
        knex.raw(`org.description -> '${lang}' as description`),
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

    if (!isEmpty(params?.search)) {
      query.whereRaw(`(
        org.title ->> 'ru' ilike '%${params.search}%'
        or org.title ->> 'en' ilike '%${params.search}%'
        or org.title ->> 'uz' ilike '%${params.search}%'
        )`);
    }

    if (limit) {
      query.limit(limit);
      if (offset) {
        query.offset(offset);
      }
    }

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

  getOrganizerByIdAdmin(id: string) {
    const knex = this.knex;

    const query = knex
      .select([
        'o.*',
        knex.raw(
          `jsonb_agg(
              jsonb_build_object(
                'url', file.url,
								'size', file.size,
								'name', file.name,
                'type', file.type
              )
            ) FILTER (WHERE file.id is not null) AS files`,
        ),
      ])
      .from(`${this.tableName} as o`)
      .leftJoin('files as file', function () {
        this.on('file.dependent_id', 'o.id').andOn(
          knex.raw('file.depend = ?', FileDependentType.organizer),
        );
      })
      .where('o.is_deleted', false)
      .where('o.id', id)
      .groupBy(['o.id'])
      .first();

    return query;
  }
}
