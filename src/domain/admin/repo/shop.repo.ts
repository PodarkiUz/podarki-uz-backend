import { Injectable } from '@nestjs/common';
import { BaseRepo } from 'src/providers/base-dao';

@Injectable()
export class AdminShopRepo extends BaseRepo<any> {
  constructor() {
    super('shop');
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
