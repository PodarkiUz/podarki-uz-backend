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
 * Verify Telegram OTP and get user info
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
  
    // Get user info from Telegram and create/update traveler
    try {
      const telegramUserInfo = await this.telegramBotService.getUserInfo(cleanUsername);
      if (telegramUserInfo) {
        // Check if user already exists
        let existingUser = await this.travelerRepo.findByTelegramId(telegramUserInfo.id);
        
        // if (!existingUser) {
        //   // Check if user exists by username
        //   existingUser = await this.travelerRepo.getByUsername(cleanUsername);
        // }
  
        if (existingUser) {
          // Update existing user with Telegram info
          const updatedUser = await this.travelerRepo.updateById(existingUser.id, {
            telegram_id: telegramUserInfo.id,
            tg_username: cleanUsername,
            first_name: telegramUserInfo.first_name,
            last_name: telegramUserInfo.last_name,
            auth_provider: 'telegram',
            updated_at: new Date(),
          });
  
          return { 
            success: true, 
            message: 'Telegram username verified and user info updated successfully',
            user: updatedUser,
            isNewUser: false
          };
        } else {
          // Create new user
          const newUser = await this.travelerRepo.insert({
            telegram_id: telegramUserInfo.id,
            tg_username: cleanUsername,
            first_name: telegramUserInfo.first_name,
            last_name: telegramUserInfo.last_name,
            auth_provider: 'telegram',
            is_active: true,
            created_at: new Date(),
            updated_at: new Date(),
          });
  
          return { 
            success: true, 
            message: 'Telegram username verified and new user created successfully',
            user: newUser,
            isNewUser: true
          };
        }
      } else {
        // OTP verified but couldn't get user info
        return { 
          success: true, 
          message: 'Telegram username verified successfully',
          user: null,
          isNewUser: false
        };
      }
    } catch (error) {
      console.error('Error getting user info from Telegram:', error);
      // OTP is still verified even if we couldn't get user info
      return { 
        success: true, 
        message: 'Telegram username verified successfully (user info could not be retrieved)',
        user: null,
        isNewUser: false
      };
    }
  }
}
