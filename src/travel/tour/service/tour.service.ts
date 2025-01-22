import { Injectable } from '@nestjs/common';
import { TourRepo } from '../repo/tour.repo';
import {
  ITourCreateParam,
  ITourSeachByName,
  ITourUpdateParam,
} from '../interface/tour.interface';
import { OrganizerStatus } from '../admin.enum';

@Injectable()
export class TourService {
  constructor(private readonly repo: TourRepo) { }

  async create(params: ITourCreateParam) {
    const tour = await this.repo.insert({
      description_ru: params?.description_ru,
      description_uz: params?.description_uz,
      name_ru: params.name_ru,
      name_uz: params.name_uz,
      location: params.location,
      organizer_id: params.organizer_id,
      price: params.price,
      status: OrganizerStatus.New,
      sale_price: params?.sale_price,
      seats: params.seats,
      start_date: params.start_date,
      duration: params?.duration,
      search_vector: this.repo.knex.raw(
        `to_tsvector('russian', '${params.name_ru}') || to_tsvector('simple', '${params.name_uz}')`,
      ),
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

  async getAllList() {
    const data = await this.repo.getAllTours();
    return data;
  }

  async searchTour(params: ITourSeachByName) {
    return this.repo.searchTour(params);
  }
}
