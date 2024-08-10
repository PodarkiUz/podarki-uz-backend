import { Injectable } from '@nestjs/common';
import { BaseRepo } from 'src/providers/base-dao';
import { ProductListByCategoryDto, SearchDto } from './dto/product.dto';
import { IUser } from '../user/interface/user.interface';
import { SortType } from './enum/product.enum';
import { krillToLatin, latinToKrill } from 'src/shared/utils/translate';
import { ListPageDto } from 'src/shared/dto/list.dto';

@Injectable()
export class ProductRepo extends BaseRepo<any> {
  constructor() {
    super('products');
  }

  listByCategory(params: ProductListByCategoryDto, user: IUser) {
    const knex = this.knexService.instance;

    const query = knex
      .select([
        'product.id',
        'product.name_uz',
        'product.name_ru',
        'product.name_en',
        'product.price',
        knex.raw(
          'coalesce(product.sale_price, product.price) as discount_price',
        ),
        'product.small_image',
        knex.raw(
          'coalesce(round(100 - ((product.discount_price / product.price) * 100)), 0) as discount',
        ),
      ])
      .from('products as product')
      // .join('category', function () {
      //   this.on('category.id', 'product.category_id')
      //     .andOn(knex.raw('category.is_deleted is not true'))
      //     .andOn(knex.raw(`category.id = '${params.category_id}'`));
      // })
      .where('product.sub_category_id', params.sub_category_id)
      .where('product.is_deleted', false);

    if (params.sort) {
      switch (params.sort) {
        case SortType.EXPENSIVE:
          query.orderBy('product.price', 'desc');
          break;

        case SortType.CHEAP:
          query.orderBy('product.price', 'asc');
          break;

        case SortType.DISCOUNT:
          query.orderBy('discount_price', 'desc');
          break;

        case SortType.RATING:
          break;

        case SortType.POPULAR:
          query.orderBy('product.price', 'desc');
          break;
      }
    }

    if (params.from_price) {
      query.whereRaw(
        `sale_price >= ${params.from_price} and sale_price <= ${params.to_price}`,
      );
    }

    return this.paginatedSelect(query, params?.page, params?.per_page);
  }

  async searchProductByName(params: ListPageDto) {
    const knex = this.knexService.instance;

    let query = knex
      .select([
        'product.id',
        'product.name_uz',
        'product.name_ru',
        'product.name_en',
        'product.price',
        knex.raw(
          'coalesce(product.sale_price, product.price) as discount_price',
        ),
        'product.small_image',
        knex.raw(
          'coalesce(round(100 - ((product.discount_price / product.price) * 100)), 0) as discount',
        ),
      ])
      .from('product as product')
      .where('product.is_deleted', false);

    const searchArr = params.search.trim().split(` `) || [];
    for (const search of searchArr) {
      const name_latin = krillToLatin(search).replace(/'/g, "''");
      const name_krill = latinToKrill(search);
      query = query.andWhere((builder) =>
        builder
          .orWhere('product.name_uz', `ilike`, `%${name_latin}%`)
          .orWhere('product.name_en', `ilike`, `%${name_latin}%`)
          .orWhere('product.name_ru', `ilike`, `%${name_krill}%`),
      );
    }

    return this.paginatedSelect(query, params?.page, params?.per_page);
  }
}
