import { Injectable } from '@nestjs/common';

import { CityRepo } from '../../shared/repo/cities.repo';
import { TourRepo } from 'src/travel/shared/repo/tour.repo';
import { PaginationParams } from 'src/travel/shared/interfaces';
import { FilesRepo } from 'src/travel/shared/repo/files.repo';
import { ITourSeachByName } from 'src/travel/admin/interface/tour.interface';

@Injectable()
export class TourService {
  constructor(
    private readonly repo: TourRepo,
    private readonly cityRepo: CityRepo,
    private readonly filesRepo: FilesRepo,
  ) {}

  async getAllList(params: PaginationParams) {
    const data = await this.repo.getAllTours(params);
    return { data, total: Number(data[0]?.total) || 0 };
  }

  async getCitiesList(params: PaginationParams) {
    const data = await this.cityRepo.getAllCities(params);
    return data;
  }

  async searchTour(params: ITourSeachByName) {
    const data = await this.repo.searchTour(params);
    return { data, total: Number(data[0]?.total) || 0 };
  }

  async getOne(id: string) {
    const data = await this.repo.getById(id);
    return data;
  }
}
