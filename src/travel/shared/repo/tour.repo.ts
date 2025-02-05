import { BaseRepo } from '@shared/providers/base-dao';
import { Injectable } from '@nestjs/common';
import { TourEntity } from 'src/travel/shared/repo/entity';
import { ITourSeachByName } from 'src/travel/client/tour/interface/tour.interface';
import { PaginationParams } from '../interfaces';

@Injectable()
export class TourRepo extends BaseRepo<TourEntity> {
  constructor() {
    super('tours');
  }

  getAllTours(params: PaginationParams) {
    const knex = this.knex;
    const { offset = 0, limit = 10 } = params;

    const query = knex
      .select(['tour.*', knex.raw('count(tour.id) over() as total')])
      .from(`${this.tableName} as tour`)
      .where('tour.is_deleted', false);

    if (params?.search) {
      query.whereRaw(`make_multilingual_tsvector(tour.title) @@ 
        (
          plainto_tsquery('english', '${params.search}') ||
          plainto_tsquery('russian', '${params.search}') ||
          plainto_tsquery('simple', '${params.search}')
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

  searchTour(params: ITourSeachByName) {
    const query = this.knex
      .select('*')
      .from(this.tableName)
      .where('is_deleted', false);

    if (params?.keyword) {
      query.whereRaw(`make_multilingual_tsvector(title) @@ 
        (
          plainto_tsquery('english', '${params.keyword}') ||
          plainto_tsquery('russian', '${params.keyword}') ||
          plainto_tsquery('simple', '${params.keyword}')
        )`);
    }

    if (params?.location) {
      query.where('location', params.location);
    }

    if (params?.from_price) {
      query.whereRaw('COALESCE(sale_price, price) >= :price', {
        price: params.from_price,
      });
    }

    if (params?.to_price) {
      query.whereRaw('COALESCE(sale_price, price) <= :price', {
        price: params.to_price,
      });
    }

    return query;
  }
}
