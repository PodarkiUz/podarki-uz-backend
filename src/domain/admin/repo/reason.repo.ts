import { BaseRepo } from '@shared/providers/base-dao';
import { Injectable } from '@nestjs/common';
import { ReasonEntity } from '../entity/reason.entity';

@Injectable()
export class ReasonRepo extends BaseRepo<ReasonEntity> {
  constructor() {
    super('reason');
  }

  getAllReasons() {
    return this.getAll({ is_deleted: false });
  }
}
