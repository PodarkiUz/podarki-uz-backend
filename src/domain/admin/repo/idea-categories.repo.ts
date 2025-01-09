import { BaseRepo } from '@shared/providers/base-dao';
import { Injectable } from '@nestjs/common';

@Injectable()
export class IdeaCategoriesRepo extends BaseRepo<any> {
  constructor() {
    super('idea_categories');
  }
}
