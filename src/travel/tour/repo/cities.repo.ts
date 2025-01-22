import { BaseRepo } from '@shared/providers/base-dao';
import { Injectable } from '@nestjs/common';
import { CityEntity } from '../entity/tour.entity';

@Injectable()
export class CityRepo extends BaseRepo<CityEntity> {
  constructor() {
    super('cities');
  }

  getAllCities() {
    return this.getAll();
  }
}
