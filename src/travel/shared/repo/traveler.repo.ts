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

  async findByEmail(email: string): Promise<TravelerEntity | null> {
    const result = await this.getOne({ email: email, is_deleted: false });
    return result || null;
  }

  async updateLastLogin(travelerId: string): Promise<void> {
    await this.updateById(travelerId, { last_login_at: new Date() });
  }

  async verifyPhone(travelerId: string): Promise<void> {
    await this.updateById(travelerId, { is_phone_verified: true });
  }

  async verifyEmail(travelerId: string): Promise<void> {
    await this.updateById(travelerId, { is_email_verified: true });
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

@Injectable()
export class TravelerSessionRepo extends BaseRepo<TravelerSessionEntity> {
  constructor() {
    super('traveler_sessions');
  }

  async createSession(
    sessionData: Omit<
      TravelerSessionEntity,
      'id' | 'created_at' | 'is_deleted'
    >,
  ): Promise<TravelerSessionEntity> {
    return this.insert(sessionData);
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

  async deleteExpiredSessions(): Promise<void> {
    await this.delete({ expires_at: { $lt: new Date() } });
  }

  async deleteAllSessionsForTraveler(travelerId: string): Promise<void> {
    await this.delete({ traveler_id: travelerId });
  }
}
