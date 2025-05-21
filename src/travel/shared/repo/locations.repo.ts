import { BaseRepo } from '@shared/providers/base-dao';
import { Injectable } from '@nestjs/common';
import { LocationEntity } from './entity';
import { PaginationParams } from '../interfaces';

@Injectable()
export class LocationRepo extends BaseRepo<LocationEntity> {
  constructor() {
    super('locations');
  }

  getAllLocations(params: PaginationParams) {
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

  getAllLocationsClient(params: PaginationParams) {
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
