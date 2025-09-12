import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { TravelerRepo } from '../../shared/repo/traveler.repo';
import { TelegramOtpRepo } from '../repo/telegram-otp.repo';
import { TelegramGatewayOtpRepo } from '../repo/telegram-gateway-otp.repo';
import { TelegramBotService } from './telegram-bot.service';
import { TelegramGatewayService } from './telegram-gateway.service';
import { TelegramUsernameDto, TelegramOtpDto } from '../dto/telegram-auth.dto';
import { TelegramPhoneDto, TelegramGatewayOtpDto } from '../dto/telegram-gateway-auth.dto';
import getFiveDigitNumberOTP from '@shared/utils/otp-generator';

@Injectable()
export class TelegramAuthService {
  constructor(
    private readonly travelerRepo: TravelerRepo,
    private readonly telegramOtpRepo: TelegramOtpRepo,
    private readonly telegramGatewayOtpRepo: TelegramGatewayOtpRepo,
    private readonly telegramBotService: TelegramBotService,
    private readonly telegramGatewayService: TelegramGatewayService,
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

  /**
   * Send OTP via Telegram Gateway API (Official Verification Codes Bot)
   */
  async sendTelegramGatewayOtp(params: TelegramPhoneDto) {
    return this.travelerRepo.knex.transaction(async (trx) => {
      // Validate phone number
      if (!this.telegramGatewayService.validatePhoneNumber(params.phoneNumber)) {
        throw new BadRequestException('Invalid phone number format');
      }

      const formattedPhone = this.telegramGatewayService.formatPhoneNumber(params.phoneNumber);

      // Check if there's an active request for this phone number
      const existingRequest = await this.telegramGatewayOtpRepo.getActiveRequest(formattedPhone);
      
      if (existingRequest) {
        // Update existing request
        await this.telegramGatewayOtpRepo.updateByIdWithTransaction(trx, existingRequest.id, {
          expires_at: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
          is_used: false,
          attempts: 0,
        });
      }

      // Send OTP via Telegram Gateway API
      const result = await this.telegramGatewayService.sendVerificationMessage({
        phoneNumber: formattedPhone,
        codeLength: 6,
        ttl: 600, // 10 minutes
        payload: 'travel-app-verification',
      });

      // Store the request ID for verification
      if (existingRequest) {
        await this.telegramGatewayOtpRepo.updateByIdWithTransaction(trx, existingRequest.id, {
          request_id: result.requestId,
        });
      } else {
        await this.telegramGatewayOtpRepo.insertWithTransaction(trx, {
          phone_number: formattedPhone,
          request_id: result.requestId,
          expires_at: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        });
      }

      return {
        success: true,
        message: `Verification code sent to ${formattedPhone} via Telegram`,
        requestId: result.requestId,
      };
    });
  }

  /**
   * Verify OTP via Telegram Gateway API
   */
  async verifyTelegramGatewayOtp(params: TelegramGatewayOtpDto) {
    // Validate phone number
    if (!this.telegramGatewayService.validatePhoneNumber(params.phoneNumber)) {
      throw new BadRequestException('Invalid phone number format');
    }

    const formattedPhone = this.telegramGatewayService.formatPhoneNumber(params.phoneNumber);

    // Get the active request for this phone number
    const request = await this.telegramGatewayOtpRepo.getActiveRequest(formattedPhone);
    
    if (!request) {
      throw new BadRequestException('No verification request found for this phone number');
    }

    if (request.is_used) {
      throw new BadRequestException('Verification code already used');
    }

    if (new Date() > request.expires_at) {
      throw new BadRequestException('Verification code expired');
    }

    if ((request.attempts || 0) >= 3) {
      throw new BadRequestException('Too many attempts. Please request a new code');
    }

    // Increment attempts
    await this.telegramGatewayOtpRepo.updateById(request.id, {
      attempts: (request.attempts || 0) + 1,
    });

    // Verify the code using Gateway API
    const isValid = await this.telegramGatewayService.checkVerificationStatus(request.request_id, params.otp_code);

    if (!isValid) {
      throw new BadRequestException('Invalid verification code');
    }

    // Mark as used
    await this.telegramGatewayOtpRepo.updateById(request.id, {
      is_used: true,
    });

    // Check if user already exists by phone number
    let existingUser = await this.travelerRepo.findByPhoneNumber(formattedPhone);
    
    if (existingUser) {
      // Update existing user
      const updatedUser = await this.travelerRepo.updateById(existingUser.id, {
        phone_number: formattedPhone,
        auth_provider: 'telegram_gateway',
        updated_at: new Date(),
      });

      return { 
        success: true, 
        message: 'Phone number verified and user info updated successfully',
        user: updatedUser,
        isNewUser: false
      };
    } else {
      // Create new user (you might want to ask for additional info)
      const newUser = await this.travelerRepo.insert({
        phone_number: formattedPhone,
        auth_provider: 'telegram_gateway',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      });

      return { 
        success: true, 
        message: 'Phone number verified and new user created successfully',
        user: newUser,
        isNewUser: true
      };
    }
  }
}
