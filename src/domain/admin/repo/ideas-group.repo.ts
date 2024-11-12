import { BaseRepo } from '@shared/providers/base-dao';
import { Injectable } from '@nestjs/common';
import { IdeasGroupEntity } from '../entity/ideas-group.entity';

@Injectable()
export class IdeasGroupRepo extends BaseRepo<IdeasGroupEntity> {
  constructor() {
    super('idea_group');
  }

  getAllIdeasGroup() {
    return this.getAll({ is_deleted: false });
  }
}
