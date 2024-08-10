import { Injectable } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { CabinetProductListDto } from 'src/domain/cabinet/dto/product.dto';
import { ICurrentShop } from 'src/domain/cabinet/interface/shop.interface';
import { BaseRepo } from 'src/providers/base-dao';
import { ListPageDto } from 'src/shared/dto/list.dto';
import { krillToLatin, latinToKrill } from 'src/shared/utils/translate';

@Injectable()
export class AdminProductRepo extends BaseRepo<any> {
  constructor() {
    super('product');
  }

  shopProductList(params: CabinetProductListDto, currentShop: ICurrentShop) {
    const query = this.knex
      .select('*')
      .from(this._tableName)
      .where('shop_id', currentShop.id);

    if (params?.on_sale) {
      query.where('on_sale', params.on_sale);
    }

    if (params?.sub_category_id) {
      query.where('sub_category_id', params.sub_category_id);
    }

    if (!isEmpty(params?.search)) {
      const searchArr = params?.search.trim().split(` `) || [];
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

    return this.paginatedSelect(query, params?.page, params?.per_page);
  }

  allProductList(params: ListPageDto) {
    const query = this.knex.select('*').from(this._tableName);

    return this.paginatedSelect(query, params?.page, params?.per_page);
  }
}
