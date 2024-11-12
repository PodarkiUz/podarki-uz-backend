import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  ICreateIdeasGroupParam,
  IUpdateIdeasGroupParam,
} from '../interface/ideas-group.interface';
import { IdeasGroupRepo } from '../repo/ideas-group.repo';

@Injectable()
export class IdeasGroupService {
  constructor(private readonly ideasGroupRepo: IdeasGroupRepo) {}

  async create(params: ICreateIdeasGroupParam) {
    const ideasGroup = await this.ideasGroupRepo.insert(params);

    return { success: true, data: ideasGroup };
  }

  async delete(id: string) {
    await this.ideasGroupRepo.updateById(id, { is_deleted: true });
    return { success: true };
  }

  async update(id: string, params: IUpdateIdeasGroupParam) {
    return this.ideasGroupRepo.updateById(id, params);
  }

  async getAllList() {
    const data = await this.ideasGroupRepo.getAllIdeasGroup();
    return data;
  }
}
