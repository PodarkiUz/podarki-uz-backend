import { BaseRepo } from '@shared/providers/base-dao';
import { Injectable } from '@nestjs/common';
import { CityEntity } from './entity';
import { ILanguage, PaginationParams } from '../interfaces';

@Injectable()
export class CityRepo extends BaseRepo<CityEntity> {
  constructor() {
    super('cities');
  }

  getAllCities(params: PaginationParams) {
    const { offset = 0, limit = 10 } = params;

    const query = this.getAll();

    if (limit) {
      query.limit(limit);
      if (offset) {
        query.offset(offset);
      }
    }

    return query;
  }

  getAllCitiesClient(params: PaginationParams) {
    const { offset = 0, limit = 10 } = params;

    const query = this.getAll();

    if (limit) {
      query.limit(limit);
      if (offset) {
        query.offset(offset);
      }
    }

    return query;
  }
}
