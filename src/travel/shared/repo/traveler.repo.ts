import { BaseRepo } from '@shared/providers/base-dao';
import { Injectable } from '@nestjs/common';
import {
  TravelerEntity,
  PhoneVerificationCodeEntity,
  TravelerSessionEntity,
} from './traveler.entity';

@Injectable()
export class TravelerRepo extends BaseRepo<TravelerEntity> {
  constructor() {
    super('travelers');
  }

  async findByPhoneNumber(phoneNumber: string): Promise<TravelerEntity | null> {
    const result = await this.getOne({
      phone_number: phoneNumber,
      is_deleted: false,
    });
    return result || null;
  }

  async findByGoogleId(googleId: string): Promise<TravelerEntity | null> {
    const result = await this.getOne({
      google_id: googleId,
      is_deleted: false,
    });
    return result || null;
  }

  async findByTelegramId(telegramId: number): Promise<TravelerEntity | null> {
    const result = await this.getOne({
      telegram_id: telegramId,
      is_deleted: false,
    });
    return result || null;
  }

  async findByEmail(email: string): Promise<TravelerEntity | null> {
    const result = await this.getOne({ email: email, is_deleted: false });
    return result || null;
  }

  async updateLastLogin(travelerId: string): Promise<void> {
    await this.updateById(travelerId, { last_login_at: new Date() });
  }

  async getByPhone(phone_number: string, trx?: any) {
    const knex = trx || this.knex;
    return knex
      .select('*')
      .from(this.tableName)
      .where('phone_number', phone_number)
      .where('is_deleted', false)
      .first();
  }

  async getByEmail(email: string, trx?: any) {
    const knex = trx || this.knex;
    return knex
      .select('*')
      .from(this.tableName)
      .where('email', email)
      .where('is_deleted', false)
      .first();
  }

  async getByGoogleId(google_id: string, trx?: any) {
    const knex = trx || this.knex;
    return knex
      .select('*')
      .from(this.tableName)
      .where('google_id', google_id)
      .where('is_deleted', false)
      .first();
  }

  async getByTelegramId(telegram_id: number, trx?: any) {
    const knex = trx || this.knex;
    return knex
      .select('*')
      .from(this.tableName)
      .where('telegram_id', telegram_id)
      .where('is_deleted', false)
      .first();
  }

  async getById(id: string, trx?: any) {
    const knex = trx || this.knex;
    return knex
      .select('*')
      .from(this.tableName)
      .where('id', id)
      .where('is_deleted', false)
      .first();
  }

  async getAllTravelers(limit = 50, offset = 0, trx?: any) {
    const knex = trx || this.knex;
    return knex
      .select('*')
      .from(this.tableName)
      .where('is_deleted', false)
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);
  }

  async search(query: string, limit = 50, offset = 0, trx?: any) {
    const knex = trx || this.knex;
    return knex
      .select('*')
      .from(this.tableName)
      .where('is_deleted', false)
      .andWhere(function () {
        this.where('first_name', 'ilike', `%${query}%`)
          .orWhere('last_name', 'ilike', `%${query}%`)
          .orWhere('email', 'ilike', `%${query}%`)
          .orWhere('phone_number', 'ilike', `%${query}%`);
      })
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);
  }

  async count(trx?: any) {
    const knex = trx || this.knex;
    const result = await knex
      .count('* as count')
      .from(this.tableName)
      .where('is_deleted', false)
      .first();

    return parseInt(result.count);
  }

  async deleteById(id: string, trx?: any) {
    const knex = trx || this.knex;
    return knex
      .update({ is_deleted: true, updated_at: knex.fn.now() })
      .from(this.tableName)
      .where('id', id)
      .returning('*');
  }

  async activateAccount(id: string, trx?: any) {
    const knex = trx || this.knex;
    return knex
      .update({ is_active: true, updated_at: knex.fn.now() })
      .from(this.tableName)
      .where('id', id)
      .returning('*');
  }

  async deactivateAccount(id: string, trx?: any) {
    const knex = trx || this.knex;
    return knex
      .update({ is_active: false, updated_at: knex.fn.now() })
      .from(this.tableName)
      .where('id', id)
      .returning('*');
  }

  async verifyPhone(id: string, trx?: any) {
    const knex = trx || this.knex;
    return knex
      .update({ is_phone_verified: true, updated_at: knex.fn.now() })
      .from(this.tableName)
      .where('id', id)
      .returning('*');
  }

  async verifyEmail(id: string, trx?: any) {
    const knex = trx || this.knex;
    return knex
      .update({ is_email_verified: true, updated_at: knex.fn.now() })
      .from(this.tableName)
      .where('id', id)
      .returning('*');
  }
}

@Injectable()
export class PhoneVerificationCodeRepo extends BaseRepo<PhoneVerificationCodeEntity> {
  constructor() {
    super('phone_verification_codes');
  }

  async createCode(
    phoneNumber: string,
    code: string,
    expiresAt: Date,
  ): Promise<PhoneVerificationCodeEntity> {
    return this.insert({
      phone_number: phoneNumber,
      code: code,
      expires_at: expiresAt,
    });
  }

  async findValidCode(
    phoneNumber: string,
    code: string,
  ): Promise<PhoneVerificationCodeEntity | null> {
    const result = await this.getOne({
      phone_number: phoneNumber,
      code: code,
      is_used: false,
      is_deleted: false,
      expires_at: { $gt: new Date() },
    });
    return result || null;
  }

  async markCodeAsUsed(codeId: string): Promise<void> {
    await this.updateById(codeId, { is_used: true });
  }

  async incrementAttempts(codeId: string): Promise<void> {
    const code = await this.getById(codeId);
    if (code) {
      await this.updateById(codeId, { attempts: (code.attempts || 0) + 1 });
    }
  }

  async deleteExpiredCodes(): Promise<void> {
    await this.delete({ expires_at: { $lt: new Date() } });
  }
}
