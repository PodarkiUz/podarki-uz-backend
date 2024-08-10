import { Injectable } from '@nestjs/common';
import { BaseRepo } from 'src/providers/base-dao';
import { ListPageDto } from 'src/shared/dto/list.dto';
import { AdminShopListDto } from '../dto/shop.dto';
import { krillToLatin, latinToKrill } from 'src/shared/utils/translate';

@Injectable()
export class AdminShopRepo extends BaseRepo<any> {
  constructor() {
    super('shop');
  }

  getAllShops(params: AdminShopListDto) {
    const query = this.knex
      .select('*')
      .from(this._tableName)
      .where('is_deleted', false);

    if (params?.search) {
      const searchArr = params.search.trim().split(` `) || [];
      for (const search of searchArr) {
        const name_latin = krillToLatin(search).replace(/'/g, "''");
        const name_krill = latinToKrill(search);
        query.andWhere((builder) =>
          builder
            .orWhere('name_uz', `ilike`, `%${name_latin}%`)
            .orWhere('name_en', `ilike`, `%${name_latin}%`)
            .orWhere('name_ru', `ilike`, `%${name_krill}%`),
        );
      }
    }

    if (params?.status) {
      query.where('status', params.status);
    }

    return this.paginatedSelect(query, params?.page, params?.per_page);
  }

  selectByLogin(login: string) {
    return this.knex
      .select('*')
      .from(this._tableName)
      .where('login', login)
      .where('is_deleted', false)
      .first();
  }
}
