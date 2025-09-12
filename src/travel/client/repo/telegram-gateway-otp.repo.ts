import { Injectable } from '@nestjs/common';
import { BaseRepo } from '@shared/providers/base-dao';

export interface TelegramGatewayOtpData {
  id?: string;
  phone_number: string;
  request_id: string;
  expires_at: Date;
  is_used?: boolean;
  attempts?: number;
  created_at?: Date;
  updated_at?: Date;
}

@Injectable()
export class TelegramGatewayOtpRepo extends BaseRepo<TelegramGatewayOtpData> {
    constructor() {
        super('telegram_gateway_otp');
    }


  async insert(data: Omit<TelegramGatewayOtpData, 'id' | 'created_at' | 'updated_at'>) {
    const [result] = await this.knex('telegram_gateway_otp')
      .insert({
        ...data,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning('*');
    return result;
  }

  async insertWithTransaction(trx: any, data: Omit<TelegramGatewayOtpData, 'id' | 'created_at' | 'updated_at'>) {
    const [result] = await trx('telegram_gateway_otp')
      .insert({
        ...data,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning('*');
    return result;
  }

  async getActiveRequest(phoneNumber: string) {
    return this.knex('telegram_gateway_otp')
      .where('phone_number', phoneNumber)
      .where('expires_at', '>', new Date())
      .where('is_used', false)
      .orderBy('created_at', 'desc')
      .first();
  }

  async getByRequestId(requestId: string) {
    return this.knex('telegram_gateway_otp')
      .where('request_id', requestId)
      .first();
  }

  async updateById(id: string, data: Partial<TelegramGatewayOtpData>) {
    const [result] = await this.knex('telegram_gateway_otp')
      .where('id', id)
      .update({
        ...data,
        updated_at: new Date(),
      })
      .returning('*');
    return result;
  }

  async updateByIdWithTransaction(trx: any, id: string, data: Partial<TelegramGatewayOtpData>) {
    const [result] = await trx('telegram_gateway_otp')
      .where('id', id)
      .update({
        ...data,
        updated_at: new Date(),
      })
      .returning('*');
    return result;
  }

  async cleanupExpired() {
    return this.knex('telegram_gateway_otp')
      .where('expires_at', '<=', new Date())
      .del();
  }
}
