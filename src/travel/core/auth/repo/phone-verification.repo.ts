import { Injectable } from '@nestjs/common';
import { BaseRepo } from '@shared/providers/base-dao';

@Injectable()
export class PhoneVerificationRepo extends BaseRepo<any> {
  constructor() {
    super('phone_verification_codes');
  }

  async getActiveCode(phone_number: string, trx?: any) {
    const knex = trx || this.knex;
    return knex
      .select('*')
      .from(this.tableName)
      .where('phone_number', phone_number)
      .where('is_deleted', false)
      .where('expires_at', '>', knex.fn.now())
      .orderBy('created_at', 'desc')
      .first();
  }

  async getByPhoneAndCode(phone_number: string, code: string, trx?: any) {
    const knex = trx || this.knex;
    return knex
      .select('*')
      .from(this.tableName)
      .where('phone_number', phone_number)
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

  async getRecentAttempts(phone_number: string, hours: number = 1, trx?: any) {
    const knex = trx || this.knex;
    const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);

    return knex
      .select('*')
      .from(this.tableName)
      .where('phone_number', phone_number)
      .where('created_at', '>', cutoffTime)
      .where('is_deleted', false)
      .orderBy('created_at', 'desc');
  }
} 