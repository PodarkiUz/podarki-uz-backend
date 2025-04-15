import { BaseRepo } from '@shared/providers/base-dao';
import { Injectable } from '@nestjs/common';
import { ILanguage, PaginationParams } from '../interfaces';

@Injectable()
export class DestinationRepo extends BaseRepo<any> {
  constructor() {
    super('destinations');
  }

  async getAllList(params: PaginationParams, lang?: ILanguage) {
    const knex = this.knex;

    const query = knex
      .select([
        'd.id',
        knex.raw(`d.title->>'${lang}' as title`),
        'd.location',
        'd.status',
        'd.created_at',
        knex.raw(`c.title->>'${lang}' as location_title`),
        knex.raw(`c.country->>'${lang}' as location_country`),
        knex.raw('count(*) over() as total'),
      ])
      .from(`${this.tableName} as d`)
      .join('cities as c', 'c.id', '=', 'd.location')
      .where('d.is_deleted', false);

    if (params.search) {
      query.whereRaw(`d.title->>'${lang}' ILIKE ?`, [`%${params.search}%`]);
    }

    if (params.limit) {
      query.limit(params.limit);
    }

    if (params.offset) {
      query.offset(params.offset);
    }

    return query;
  }
}
