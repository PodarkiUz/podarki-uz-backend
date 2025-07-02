import { Injectable } from '@nestjs/common';
import { BaseRepo } from '@shared/providers/base-dao';
import { TravelerSessionEntity } from 'src/travel/shared/repo/traveler.entity';

@Injectable()
export class TravelerSessionRepo extends BaseRepo<any> {
  constructor() {
    super('traveler_sessions');
  }

  async createSession(
    sessionData: {
      traveler_id: string;
      access_token: string;
      refresh_token?: string;
      expires_at: Date;
      device_info?: any;
      ip_address?: string;
    },
    trx?: any,
  ) {
    const knex = trx || this.knex;
    return knex
      .insert({
        ...sessionData,
        device_info: sessionData.device_info
          ? JSON.stringify(sessionData.device_info)
          : null,
      })
      .into(this.tableName)
      .returning('*');
  }

  async getByAccessToken(access_token: string, trx?: any) {
    const knex = trx || this.knex;
    return knex
      .select('*')
      .from(this.tableName)
      .where('access_token', access_token)
      .where('is_deleted', false)
      .where('expires_at', '>', knex.fn.now())
      .first();
  }

  async getByRefreshToken(refresh_token: string, trx?: any) {
    const knex = trx || this.knex;
    return knex
      .select('*')
      .from(this.tableName)
      .where('refresh_token', refresh_token)
      .where('is_deleted', false)
      .where('expires_at', '>', knex.fn.now())
      .first();
  }

  async getByTravelerId(traveler_id: string, trx?: any) {
    const knex = trx || this.knex;
    return knex
      .select('*')
      .from(this.tableName)
      .where('traveler_id', traveler_id)
      .where('is_deleted', false)
      .where('expires_at', '>', knex.fn.now())
      .orderBy('created_at', 'desc');
  }

  async invalidateSession(id: string, trx?: any) {
    const knex = trx || this.knex;
    return knex
      .update({ is_deleted: true, updated_at: knex.fn.now() })
      .from(this.tableName)
      .where('id', id)
      .returning('*');
  }

  async invalidateAllSessions(traveler_id: string, trx?: any) {
    const knex = trx || this.knex;
    return knex
      .update({ is_deleted: true, updated_at: knex.fn.now() })
      .from(this.tableName)
      .where('traveler_id', traveler_id)
      .where('is_deleted', false)
      .returning('*');
  }

  async deleteExpiredSessions(trx?: any) {
    const knex = trx || this.knex;
    return knex
      .update({ is_deleted: true, updated_at: knex.fn.now() })
      .from(this.tableName)
      .where('expires_at', '<', knex.fn.now())
      .where('is_deleted', false)
      .returning('*');
  }

  async getActiveSessionsCount(traveler_id: string, trx?: any) {
    const knex = trx || this.knex;
    const result = await knex
      .count('* as count')
      .from(this.tableName)
      .where('traveler_id', traveler_id)
      .where('is_deleted', false)
      .where('expires_at', '>', knex.fn.now())
      .first();

    return parseInt(result.count);
  }

  async findByAccessToken(
    accessToken: string,
  ): Promise<TravelerSessionEntity | null> {
    const result = await this.getOne({
      access_token: accessToken,
      is_deleted: false,
    });
    return result || null;
  }

  async findByRefreshToken(
    refreshToken: string,
  ): Promise<TravelerSessionEntity | null> {
    const result = await this.getOne({
      refresh_token: refreshToken,
      is_deleted: false,
    });
    return result || null;
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.delete({ id: sessionId });
  }

  async deleteAllSessionsForTraveler(travelerId: string): Promise<void> {
    await this.delete({ traveler_id: travelerId });
  }
}
