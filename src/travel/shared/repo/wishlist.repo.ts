import { Injectable } from '@nestjs/common';
import { BaseRepo } from '@shared/providers/base-dao';
import { WishlistEntity } from './entity';

@Injectable()
export class WishlistRepo extends BaseRepo<WishlistEntity> {
  constructor() {
    super('wishlist');
  }
}
