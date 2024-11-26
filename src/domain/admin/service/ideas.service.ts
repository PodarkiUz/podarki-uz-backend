import { Injectable } from '@nestjs/common';
import { IdeasRepo } from '../repo/ideas.repo';
import { IdeasFiltersRepo } from '../repo/filters.repo';
import {
  ICreateIdeasFilterParam,
  ICreateIdeasParam,
  IUpdateIdeasParam,
} from '../interface/ideas.interface';

@Injectable()
export class IdeasService {
  constructor(
    private readonly ideasRepo: IdeasRepo,
    private readonly ideasFiltersRepo: IdeasFiltersRepo,
  ) {}

  async create(params: ICreateIdeasParam) {
    return this.ideasRepo.knex.transaction(async (trx) => {
      const idea = await this.ideasRepo.insertWithTransaction(trx, {
        name_ru: params.name_ru,
        name_uz: params.name_uz,
        description_ru: params?.description_ru,
        description_uz: params?.description_uz,
        group_id: params?.group_id,
        image: params?.image,
      });

      const filters: ICreateIdeasFilterParam[] = [];

      for (const f of params.filters) {
        for (const v of f.values) {
          filters.push({ filter_value_id: v, idea_id: idea.id });
        }
      }

      await this.ideasFiltersRepo.bulkInsertWithTransaction(trx, filters);

      return { success: true, data: idea };
    });
  }

  async delete(id: string) {
    await this.ideasRepo.updateById(id, { is_deleted: true });
    return { success: true };
  }

  async update(id: string, params: IUpdateIdeasParam) {
    return this.ideasRepo.updateById(id, params);
  }

  async getAllList() {
    const data = await this.ideasRepo.getAllIdeas();
    return data;
  }

  async addIdeasFilter(params: ICreateIdeasFilterParam) {
    const ideaFilter = await this.ideasFiltersRepo.insert(params);
    return { success: true, data: ideaFilter };
  }
}
