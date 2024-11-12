import { Injectable } from '@nestjs/common';
import {
  ICreateReasonParam,
  IUpdateReasonParam,
} from '../interface/reason.interface';
import { IdeasRepo } from '../repo/ideas.repo';
import { IdeasFiltersRepo } from '../repo/filters.repo';
import { ICreateIdeasFilterParam } from '../interface/ideas.interface';

@Injectable()
export class IdeasService {
  constructor(
    private readonly ideasRepo: IdeasRepo,
    private readonly ideasFiltersRepo: IdeasFiltersRepo,
  ) {}

  async create(params: ICreateReasonParam) {
    const reason = await this.ideasRepo.insert(params);

    return { success: true, data: reason };
  }

  async delete(id: string) {
    await this.ideasRepo.updateById(id, { is_deleted: true });
    return { success: true };
  }

  async update(id: string, params: IUpdateReasonParam) {
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
