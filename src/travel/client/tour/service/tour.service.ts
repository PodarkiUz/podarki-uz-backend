import { Injectable } from '@nestjs/common';
import {
  ITourCreateParam,
  ITourSeachByName,
  ITourUpdateParam,
} from '../interface/tour.interface';
import { OrganizerStatus } from '../admin.enum';
import { CityRepo } from '../../../shared/repo/cities.repo';
import { TourRepo } from 'src/travel/shared/repo/tour.repo';
import { PaginationParams } from 'src/travel/shared/interfaces';

@Injectable()
export class TourService {
  constructor(
    private readonly repo: TourRepo,
    private readonly cityRepo: CityRepo,
  ) { }

  async create(params: ITourCreateParam) {
    const tour = await this.repo.insert({
      title: params?.title,
      description: params?.description,
      location: params.location,
      organizer_id: params.organizer_id,
      price: params.price,
      status: OrganizerStatus.New,
      sale_price: params?.sale_price > 0 ? params.sale_price : null,
      seats: params.seats,
      start_date: params.start_date,
      duration: params?.duration,
    });

    return { success: true, data: tour };
  }

  async delete(id: string) {
    await this.repo.updateById(id, { is_deleted: true });
    return { success: true };
  }

  async update(id: string, params: ITourUpdateParam) {
    return this.repo.updateById(id, params);
  }

  async getAllList(params: PaginationParams) {
    const data = await this.repo.getAllTours(params);
    return { data, total: Number(data[0]?.total) || 0 };
  }

  async getCitiesList() {
    const data = await this.cityRepo.getAllCities();
    return data;
  }

  async searchTour(params: ITourSeachByName) {
    const data = await this.repo.searchTour(params);
    return { data, total: Number(data[0]?.total) || 0 };
  }
}
