import { Injectable } from '@nestjs/common';
import { BaseRepo } from '@shared/providers/base-dao';

export interface TelegramOtpEntity {
  id?: string;
  created_at?: Date;
  expires_at: Date;
  is_deleted?: boolean;
  username: string;
  code: string;
  is_used?: boolean;
  attempts?: number;
}

@Injectable()
export class TelegramOtpRepo extends BaseRepo<TelegramOtpEntity> {
  constructor() {
    super('telegram_otp_codes');
  }

  async getActiveCode(username: string, trx?: any) {
    const knex = trx || this.knex;
    return knex
      .select('*')
      .from(this.tableName)
      .where('username', username)
      .where('is_deleted', false)
      .where('expires_at', '>', knex.fn.now())
      .orderBy('created_at', 'desc')
      .first();
  }

  async getByUsernameAndCode(username: string, code: string, trx?: any) {
    const knex = trx || this.knex;
    return knex
      .select('*')
      .from(this.tableName)
      .where('username', username)
      .where('code', code)
      .where('is_deleted', false)
      .first();
  }

  async markAsUsed(id: string, trx?: any) {
    const knex = trx || this.knex;
    return knex
      .update({ is_used: true, updated_at: knex.fn.now() })
      .from(this.tableName)
      .where('id', id)
      .returning('*');
  }

  async deleteExpiredCodes(trx?: any) {
    const knex = trx || this.knex;
    return knex
      .update({ is_deleted: true, updated_at: knex.fn.now() })
      .from(this.tableName)
      .where('expires_at', '<', knex.fn.now())
      .where('is_deleted', false)
      .returning('*');
  }

  async getRecentAttempts(username: string, hours: number = 1, trx?: any) {
    const knex = trx || this.knex;
    const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);

    return knex
      .select('*')
      .from(this.tableName)
      .where('username', username)
      .where('created_at', '>', cutoffTime)
      .where('is_deleted', false)
      .orderBy('created_at', 'desc');
  }

  async insertWithTransaction(trx: any, data: Partial<TelegramOtpEntity>) {
    return trx
      .insert({
        ...data,
        created_at: trx.fn.now(),
        updated_at: trx.fn.now(),
      })
      .into(this.tableName)
      .returning('*');
  }

  async updateByIdWithTransaction(trx: any, id: string, data: Partial<TelegramOtpEntity>) {
    return trx
      .update({
        ...data,
        updated_at: trx.fn.now(),
      })
      .from(this.tableName)
      .where('id', id)
      .returning('*');
  }
}
