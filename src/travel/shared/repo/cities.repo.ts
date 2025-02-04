import { BaseRepo } from '@shared/providers/base-dao';
import { Injectable } from '@nestjs/common';
import { FilesEntity } from './entity';

@Injectable()
export class CityRepo extends BaseRepo<FilesEntity> {
  constructor() {
    super('cities');
  }

  getAllCities() {
    return this.getAll();
  }
}
