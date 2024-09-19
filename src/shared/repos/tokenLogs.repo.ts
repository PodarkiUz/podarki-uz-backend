import { Injectable } from '@nestjs/common';
import { BaseRepo } from '@shared/providers/base-dao';

@Injectable()
export class TokenLogs extends BaseRepo<any> {
  constructor() {
    super('public.bepro_token_logs');
  }

  getLastToken() {
    return this.knex
      .select('id', 'created_at', 'request_body', 'response_body')
      .from(this.tableName)
      .orderBy('id', 'desc')
      .orderBy('created_at', 'desc')
      .first();
  }
}
