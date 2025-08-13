import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { TravelerRepo } from '../../shared/repo/traveler.repo';
import { TelegramOtpRepo } from '../repo/telegram-otp.repo';
import { TelegramBotService } from './telegram-bot.service';
import { TelegramUsernameDto, TelegramOtpDto } from '../dto/telegram-auth.dto';
import getFiveDigitNumberOTP from '@shared/utils/otp-generator';

@Injectable()
export class TelegramAuthService {
  constructor(
    private readonly travelerRepo: TravelerRepo,
    private readonly telegramOtpRepo: TelegramOtpRepo,
    private readonly telegramBotService: TelegramBotService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Send OTP to Telegram username
   */
  async sendTelegramOtp(params: TelegramUsernameDto) {
    return this.travelerRepo.knex.transaction(async (trx) => {
      // Clean username (remove @ if present)
      const cleanUsername = params.username.startsWith('@') ? params.username.slice(1) : params.username;
      
      // Verify username exists and is accessible
      const isUsernameValid = await this.telegramBotService.verifyUsername(cleanUsername);
      if (!isUsernameValid) {
        throw new BadRequestException(`User @${cleanUsername} not found or not started the bot`);
      }

      // Generate OTP
      const otp = getFiveDigitNumberOTP().toString();
      const hashedOtp = bcrypt.hashSync(otp, 10);

      // Check if verification code already exists
      const existingCode = await this.telegramOtpRepo.getActiveCode(cleanUsername, trx);

      if (existingCode) {
        // Update existing code
        await this.telegramOtpRepo.updateByIdWithTransaction(trx, existingCode.id, {
          code: hashedOtp,
          expires_at: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
          attempts: 0,
          is_used: false,
        });
      } else {
        // Create new verification code
        await this.telegramOtpRepo.insertWithTransaction(trx, {
          username: cleanUsername,
          code: hashedOtp,
          expires_at: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        });
      }

      // Send OTP via Telegram
      await this.telegramBotService.sendOtpMessage(cleanUsername, otp);

      return {
        success: true,
        message: `Verification code sent to @${cleanUsername} via Telegram`,
      };
    });
  }

  /**
   * Verify Telegram OTP
   */
  async verifyTelegramOtp(params: TelegramOtpDto) {
    const cleanUsername = params.username.startsWith('@') ? params.username.slice(1) : params.username;
    
    const verificationCode = await this.telegramOtpRepo.getActiveCode(cleanUsername);

    if (!verificationCode) {
      throw new BadRequestException('No verification code found for this username');
    }

    if (verificationCode.is_used) {
      throw new BadRequestException('Verification code already used');
    }

    if (new Date() > verificationCode.expires_at) {
      throw new BadRequestException('Verification code expired');
    }

    if (verificationCode.attempts >= 3) {
      throw new BadRequestException('Too many attempts. Please request a new code');
    }

    // Increment attempts
    await this.telegramOtpRepo.updateById(verificationCode.id, {
      attempts: (verificationCode.attempts || 0) + 1,
    });

    if (!bcrypt.compareSync(params.otp_code, verificationCode.code)) {
      throw new BadRequestException('Invalid verification code');
    }

    // Mark code as used
    await this.telegramOtpRepo.updateById(verificationCode.id, {
      is_used: true,
    });

    return { success: true, message: 'Telegram username verified successfully' };
  }
}
