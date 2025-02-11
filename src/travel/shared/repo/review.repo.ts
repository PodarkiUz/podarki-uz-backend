import { BaseRepo } from '@shared/providers/base-dao';
import { Injectable } from '@nestjs/common';
import { ReviewEntity } from './entity';

@Injectable()
export class ReviewRepo extends BaseRepo<ReviewEntity> {
  constructor() {
    super('reviews');
  }
}
