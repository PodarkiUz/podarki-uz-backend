import { Injectable } from '@nestjs/common';
import {
  ICreateFilterParam,
  ICreateFilterValueParam,
  IUpdateFilterParam,
} from '../interface/filters.interface';
import { FiltersRepo, FilterValuesRepo } from '../repo/filters.repo';

@Injectable()
export class FiltersService {
  constructor(
    private readonly filterRepo: FiltersRepo,
    private readonly filterValuesRepo: FilterValuesRepo,
  ) {}

  async create(params: ICreateFilterParam) {
    return this.filterRepo.knex.transaction(async (trc) => {
      const filter = await this.filterRepo.insert({
        name_ru: params.name_ru,
        name_uz: params.name_uz,
      });

      await this.filterValuesRepo.bulkInsertWithTransaction(
        trc,
        params.values.map((value) => {
          return {
            filter_id: filter.id,
            value_ru: value.name_ru,
            value_uz: value.name_uz,
          };
        }),
      );

      return { success: true };
    });
  }

  async createFilterValue(params: ICreateFilterValueParam) {
    const filterValues = await this.filterValuesRepo.bulkInsertWithTransaction(
      this.filterValuesRepo.knex,
      params.values.map((value) => {
        return {
          filter_id: params.filter_id,
          value_ru: value.name_ru,
          value_uz: value.name_uz,
        };
      }),
    );

    return { success: true, data: filterValues };
  }

  async delete(id: string) {
    await this.filterRepo.updateById(id, { is_deleted: true });
    return { success: true };
  }

  async update(id: string, params: IUpdateFilterParam) {
    return this.filterRepo.updateById(id, params);
  }

  async getAllList() {
    const data = await this.filterRepo.getAllFilters();
    return data;
  }
}
