import { Injectable } from '@nestjs/common';
import { WishlistRepo } from 'src/travel/shared/repo/wishlist.repo';
import {
  CreateWishlistDto,
  DeleteWishlistDto,
  GetWishlistListDto,
  UpdateWishlistDto,
} from '../dto/wishlist.dto';
import { OneByIdDto } from 'src/travel/shared/dtos';

@Injectable()
export class WishlistService {
  constructor(private readonly wishlistRepo: WishlistRepo) { }

  async create(payload: CreateWishlistDto) {
    return this.wishlistRepo.insert({
      owner_id: payload.owner_id,
      title: payload.title,
      imageurl: payload.imageUrl,
      producturl: payload.productUrl,
    });
  }

  async findAll(params: GetWishlistListDto) {
    const { limit = 10, offset = 0, search, owner_id } = params;
    limit;
    const query = this.wishlistRepo.knex
      .select(['id', 'title', 'imageurl', 'producturl'])
      .from(this.wishlistRepo.tableName)
      .where('owner_id', owner_id)
      // .limit(limit)
      .offset(offset);

    if (search) {
      query.where('title', 'ilike', `%${search}%`);
    }

    const data = await query;

    const totalRow = await this.wishlistRepo.knex
      .count('id as count')
      .from(this.wishlistRepo.tableName)
      .modify((qb) => {
        if (search) {
          qb.where('title', 'ilike', `%${search}%`);
        }
      })
      .first();

    return {
      data,
      total: totalRow ? Number((totalRow as { count?: string }).count ?? 0) : 0,
      // limit,
      offset,
    };
  }

  async findOne(payload: OneByIdDto) {
    return this.wishlistRepo.getById(payload.id);
  }

  async update(payload: UpdateWishlistDto) {
    const { id, ...updateData } = payload;
    return this.wishlistRepo.updateById(id, {
      ...updateData,
      owner_id: payload.owner_id,
    });
  }

  async remove(payload: DeleteWishlistDto) {
    return this.wishlistRepo.delete({
      id: payload.id,
      owner_id: payload.owner_id,
    });
  }
}
