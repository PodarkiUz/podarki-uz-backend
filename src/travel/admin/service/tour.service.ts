import { Injectable } from '@nestjs/common';
import {
  ITourCreateParam,
  ITourSeachByName,
  ITourUpdateParam,
} from '../interface/tour.interface';
import { CityRepo } from '../../shared/repo/cities.repo';
import { TourRepo } from 'src/travel/shared/repo/tour.repo';
import { PaginationParams } from 'src/travel/shared/interfaces';
import { FileDependentType, OrganizerStatus } from 'src/travel/shared/enums';
import { isEmpty } from 'lodash';
import { compareArrays } from 'src/travel/shared/utils';
import { FilesRepo } from 'src/travel/shared/repo/files.repo';

@Injectable()
export class TourService {
  constructor(
    private readonly repo: TourRepo,
    private readonly cityRepo: CityRepo,
    private readonly filesRepo: FilesRepo,
  ) {}

  async create(params: ITourCreateParam) {
    return this.repo.knex.transaction(async (trc) => {
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

      if (!isEmpty(params?.files)) {
        await this.filesRepo.bulkInsertWithTransaction(
          trc,
          params.files.map((file) => ({
            depend: FileDependentType.tour,
            dependent_id: tour.id,
            name: file.name,
            size: file.size,
            type: file.type,
            url: file.url,
          })),
        );
      }

      return { success: true, data: tour };
    });
  }

  async delete(id: string) {
    await this.repo.updateById(id, { is_deleted: true });
    return { success: true };
  }

  async update(id: string, params: ITourUpdateParam) {
    return this.repo.knex.transaction(async (trc) => {
      const data: Record<string, any> = {
        ...(params?.title && { title: params.title }),
        ...(params?.description && { first_name: params.description }),
        ...(params?.duration && { last_name: params.duration }),
        ...(params?.start_date && { last_name: params.start_date }),
        ...(params?.end_date && { last_name: params.end_date }),
        ...(params?.location && { last_name: params.location }),
        ...(params?.organizer_id && { last_name: params.organizer_id }),
        ...(params?.price && { last_name: params.price }),
        ...(params?.sale_price && { last_name: params.sale_price }),
        ...(params?.seats && { last_name: params.seats }),
      };

      if (!isEmpty(data)) {
        await this.repo.updateByIdWithTransaction(trc, id, data);
      }

      // Files update logic
      if (!isEmpty(params?.files)) {
        const old_files = await this.filesRepo.getAll({ dependent_id: id });
        const { itemsToAdd, itemsToRemove } = compareArrays(
          old_files,
          params?.files,
          'name',
        );

        if (!isEmpty(itemsToRemove)) {
          await this.filesRepo.bulkDeleteByIdsWithTransaction(
            trc,
            itemsToRemove.map((i) => i['id']),
          );
        }

        if (!isEmpty(itemsToAdd)) {
          await this.filesRepo.bulkInsertWithTransaction(
            trc,
            itemsToAdd.map((i) => ({
              dependent_id: id,
              depend: FileDependentType.tour,
              name: i.name,
              url: i.url,
              size: i?.size,
              type: i.type,
            })),
            ['id'],
          );
        }
      }

      return { success: true };
    });
  }

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
