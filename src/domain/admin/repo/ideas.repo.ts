import { BaseRepo } from '@shared/providers/base-dao';
import { Injectable } from '@nestjs/common';
import { IdeasEntity } from '../entity/ideas.entity';

@Injectable()
export class IdeasRepo extends BaseRepo<IdeasEntity> {
  constructor() {
    super('ideas');
  }

  getAllIdeas() {
    return this.getAll({ is_deleted: false });
  }
}
