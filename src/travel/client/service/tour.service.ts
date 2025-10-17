import { Injectable } from '@nestjs/common';

import { CityRepo } from '../../shared/repo/cities.repo';
import { TourRepo } from 'src/travel/shared/repo/tour.repo';
import { ILanguage, PaginationParams } from 'src/travel/shared/interfaces';
import { FilesRepo } from 'src/travel/shared/repo/files.repo';
import { ITourSeachByName } from 'src/travel/admin/interface/tour.interface';
import { IGetTourListClient } from '../interface/tour.interface';
import { LocationRepo } from 'src/travel/shared/repo/locations.repo';

@Injectable()
export class TourService {
  constructor(
    private readonly repo: TourRepo,
    private readonly cityRepo: CityRepo,
    private readonly locationsRepo: LocationRepo,
  ) {}

  async getAllList(params: IGetTourListClient, lang: ILanguage) {
    const data = await this.repo.getAllToursClient(params, lang);
    return { data, total: Number(data[0]?.total) || 0 };
  }

  async getCitiesList(params: PaginationParams) {
    const data = await this.cityRepo.getAllCitiesClient(params);
    return data;
  }

  async getLocationsList(params: PaginationParams) {
    const data = await this.locationsRepo.getAllLocationsClient(params);
    return data;
  }

  async searchTour(params: ITourSeachByName) {
    const data = await this.repo.searchTour(params);
    return { data, total: Number(data[0]?.total) || 0 };
  }

  async getOne(id: string, lang: ILanguage) {
    const data = await this.repo.getTourByIdClient(id, lang);
    return data;
  }
}
