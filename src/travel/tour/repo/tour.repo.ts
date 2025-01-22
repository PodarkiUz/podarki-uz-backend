import { BaseRepo } from '@shared/providers/base-dao';
import { Injectable } from '@nestjs/common';
import { TourEntity } from '../entity/tour.entity';
import { ITourSeachByName } from '../interface/tour.interface';

@Injectable()
export class TourRepo extends BaseRepo<TourEntity> {
  constructor() {
    super('tours');
  }

  getAllTours() {
    return this.getAll({ is_deleted: false });
  }

  searchByTourName(params: ITourSeachByName) {
    const query = this.knex
      .select('*')
      .from(this.tableName)
      .where((q) => {
        q.whereRaw(
          `search_vector @@ to_tsquery('russian', ?)`,
          params.keyword,
        ).orWhereRaw(
          `search_vector @@ to_tsquery('simple', ?)`,
          params.keyword,
        );
      });

    if (params?.location) {
      query.where('location', params.location);
    }

    return query;
  }
}
