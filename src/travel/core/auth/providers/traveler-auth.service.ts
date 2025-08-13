import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthUserDao } from '../repo/auth.repo';
import { GoogleOAuthService } from '../google-oauth.service';
import { PhoneVerificationRepo } from '../repo/phone-verification.repo';
import { TravelerSessionRepo } from '../repo/traveler-session.repo';
import {
  TravelerPhoneAuthDto,
  TravelerConfirmOtpDto,
  TravelerGoogleAuthDto,
  TravelerSignUpDto,
  TravelerSignInDto,
  AuthProvider,
} from '../dto/traveler-auth.dto';
import getFiveDigitNumberOTP from '@shared/utils/otp-generator';
import { TravelerRepo } from 'src/travel/shared/repo/traveler.repo';

export interface TravelerTokenPayload {
  id: string;
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  is_phone_verified: boolean;
  is_email_verified: boolean;
}

@Injectable()
export class TravelerAuthService {
  @Inject() private readonly authUserDao: AuthUserDao;
  @Inject() private readonly travelerRepo: TravelerRepo;
  @Inject() private readonly phoneVerificationRepo: PhoneVerificationRepo;
  @Inject() private readonly travelerSessionRepo: TravelerSessionRepo;
  @Inject() private readonly googleOAuthService: GoogleOAuthService;
  @Inject() readonly jwtService: JwtService;

  async createTravelerToken(
    traveler: any,
  ): Promise<{ accessToken: string; refreshToken: string; success: boolean }> {
    const payload: TravelerTokenPayload = {
      id: traveler.id,
      email: traveler.email,
      phone_number: traveler.phone_number,
      first_name: traveler.first_name,
      last_name: traveler.last_name,
      is_phone_verified: traveler.is_phone_verified,
      is_email_verified: traveler.is_email_verified,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '23h',
      secret: process.env.JWT_SECRET || 'NO_SECRET_JWT',
    });

    const refreshToken = await this.jwtService.signAsync(
      { id: traveler.id },
      {
        expiresIn: '14d',
        secret: process.env.JWT_SECRET || 'NO_SECRET_JWT',
      },
    );

    // Store session
    await this.travelerSessionRepo.createSession({
      traveler_id: traveler.id,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: new Date(Date.now() + 23 * 60 * 60 * 1000), // 23 hours
    });

    return { accessToken, refreshToken, success: true };
  }

  async sendPhoneVerification(
    params: TravelerPhoneAuthDto,
  ): Promise<{ success: boolean; message: string }> {
    return this.travelerRepo.knex.transaction(async (trx) => {
      const otp = getFiveDigitNumberOTP().toString();
      const hashedOtp = bcrypt.hashSync(otp, 10);

      // Check if verification code already exists
      const existingCode = await this.phoneVerificationRepo.getActiveCode(
        params.phone_number,
        trx,
      );

      if (existingCode) {
        // Update existing code
        await this.phoneVerificationRepo.updateByIdWithTransaction(
          trx,
          existingCode.id,
          {
            code: hashedOtp,
            expires_at: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
            attempts: 0,
            is_used: false,
          },
        );
      } else {
        // Create new verification code
        await this.phoneVerificationRepo.insertWithTransaction(trx, {
          phone_number: params.phone_number,
          code: hashedOtp,
          expires_at: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        });
      }

      // TODO: Integrate with SMS service to send OTP
      console.log(`OTP for ${params.phone_number}: ${otp}`);

      return {
        success: true,
        message: `Verification code sent to ${params.phone_number}`,
      };
    });
  }

  async verifyPhoneOtp(
    params: TravelerConfirmOtpDto,
  ): Promise<{ success: boolean; message: string }> {
    const verificationCode = await this.phoneVerificationRepo.getActiveCode(
      params.phone_number,
    );

    if (!verificationCode) {
      throw new BadRequestException(
        'No verification code found for this phone number',
      );
    }

    if (verificationCode.is_used) {
      throw new BadRequestException('Verification code already used');
    }

    if (new Date() > verificationCode.expires_at) {
      throw new BadRequestException('Verification code expired');
    }

    if (verificationCode.attempts >= 3) {
      throw new BadRequestException(
        'Too many attempts. Please request a new code',
      );
    }

    // Increment attempts
    await this.phoneVerificationRepo.updateById(verificationCode.id, {
      attempts: verificationCode.attempts + 1,
    });

    if (!bcrypt.compareSync(params.otp_code, verificationCode.code)) {
      throw new BadRequestException('Invalid verification code');
    }

    // Mark code as used
    await this.phoneVerificationRepo.updateById(verificationCode.id, {
      is_used: true,
    });

    return { success: true, message: 'Phone number verified successfully' };
  }

  async signUpWithPhone(
    params: TravelerSignUpDto,
  ): Promise<{ accessToken: string; refreshToken: string; success: boolean }> {
    return this.travelerRepo.knex.transaction(async (trx) => {
      // Check if user already exists
      const existingTraveler = await this.travelerRepo.getByPhone(
        params.phone_number,
        trx,
      );
      if (existingTraveler) {
        throw new BadRequestException(
          'User with this phone number already exists',
        );
      }

      const existingEmail = await this.travelerRepo.getByEmail(
        params.email,
        trx,
      );
      if (existingEmail) {
        throw new BadRequestException('User with this email already exists');
      }

      // Create new traveler
      const travelerData = {
        first_name: params.first_name,
        last_name: params.last_name,
        email: params.email,
        phone_number: params.phone_number,
        date_of_birth: params.date_of_birth
          ? params.date_of_birth
          : null,
        gender: params.gender,
        nationality: params.nationality,
        passport_number: params.passport_number,
        home_country: params.home_country,
        home_city: params.home_city,
        is_phone_verified: true, // Since they went through phone verification
        is_email_verified: false,
        is_active: true,
        last_login_at: new Date(),
      };

      const traveler = await this.travelerRepo.insertWithTransaction(
        trx,
        travelerData,
      );
      return this.createTravelerToken(traveler);
    });
  }

  async signInWithPhone(
    phone_number: string,
  ): Promise<{ accessToken: string; refreshToken: string; success: boolean }> {
    const traveler = await this.travelerRepo.getByPhone(phone_number);

    if (!traveler) {
      throw new NotFoundException('Traveler not found');
    }

    if (!traveler.is_active) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Update last login
    await this.travelerRepo.updateById(traveler.id, {
      last_login_at: new Date(),
    });

    return this.createTravelerToken(traveler);
  }

  async signInWithGoogle(
    params: TravelerGoogleAuthDto,
  ): Promise<{ accessToken: string; refreshToken: string; success: boolean }> {
    // Verify Google token
    const googleUser = await this.googleOAuthService.verifyToken(
      params.token,
      params.token_type,
    );

    // Find or create traveler
    let traveler = await this.travelerRepo.getByGoogleId(googleUser.sub);

    if (!traveler) {
      // Check if user exists with this email
      traveler = await this.travelerRepo.getByEmail(googleUser.email);

      if (traveler) {
        // Update existing user with Google info
        await this.travelerRepo.updateById(traveler.id, {
          google_id: googleUser.sub,
          google_email: googleUser.email,
          is_email_verified: true,
          avatar_url: googleUser.picture,
          last_login_at: new Date(),
        });
      } else {
        // Create new traveler
        const travelerData = {
          first_name: googleUser.given_name,
          last_name: googleUser.family_name,
          email: googleUser.email,
          phone_number: null, // Will be set later if needed
          google_id: googleUser.sub,
          google_email: googleUser.email,
          avatar_url: googleUser.picture,
          is_phone_verified: false,
          is_email_verified: true,
          is_active: true,
          last_login_at: new Date(),
        };

        traveler = await this.travelerRepo.insert(travelerData);
      }
    } else {
      // Update last login
      await this.travelerRepo.updateById(traveler.id, {
        last_login_at: new Date(),
      });
    }

    return this.createTravelerToken(traveler);
  }

  async signIn(
    params: TravelerSignInDto,
  ): Promise<{ accessToken: string; refreshToken: string; success: boolean }> {
    if (params.provider === AuthProvider.PHONE) {
      if (!params.phone_number) {
        throw new BadRequestException(
          'Phone number is required for phone authentication',
        );
      }
      return this.signInWithPhone(params.phone_number);
    } else if (params.provider === AuthProvider.GOOGLE) {
      if (!params.google_token || !params.google_token_type) {
        throw new BadRequestException(
          'Google token and token type are required for Google authentication',
        );
      }
      return this.signInWithGoogle({
        token: params.google_token,
        token_type: params.google_token_type,
      });
    }

    throw new BadRequestException('Invalid authentication provider');
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string; success: boolean }> {
    return this.travelerRepo.knex.transaction(async (trx) => {
      const verified = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_SECRET || 'NO_SECRET_JWT',
      });

      if (!verified) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const session = await this.travelerSessionRepo.getByRefreshToken(
        refreshToken,
        trx,
      );
      if (!session) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Invalidate old session
      await this.travelerSessionRepo.updateByIdWithTransaction(
        trx,
        session.id,
        {
          is_deleted: true,
        },
      );

      const traveler = await this.travelerRepo.getById(
        session.traveler_id,
        trx,
      );
      if (!traveler) {
        throw new NotFoundException('Traveler not found');
      }

      return this.createTravelerToken(traveler);
    });
  }

  async logout(
    accessToken: string,
  ): Promise<{ success: boolean; message: string }> {
    const session = await this.travelerSessionRepo.getByAccessToken(
      accessToken,
    );

    if (session) {
      await this.travelerSessionRepo.updateById(session.id, {
        is_deleted: true,
      });
    }

    return { success: true, message: 'Logged out successfully' };
  }

  async getProfile(travelerId: string): Promise<any> {
    const traveler = await this.travelerRepo.getById(travelerId);

    if (!traveler) {
      throw new NotFoundException('Traveler not found');
    }

    // Remove sensitive fields
    delete traveler.password_hash;

    return traveler;
  }

  async updateProfile(
    travelerId: string,
    updateData: Partial<TravelerSignUpDto>,
  ): Promise<any> {
    const traveler = await this.travelerRepo.getById(travelerId);

    if (!traveler) {
      throw new NotFoundException('Traveler not found');
    }

    // Check if email is being changed and if it's already taken
    if (updateData.email && updateData.email !== traveler.email) {
      const existingEmail = await this.travelerRepo.getByEmail(
        updateData.email,
      );
      if (existingEmail && existingEmail.id !== travelerId) {
        throw new BadRequestException('Email already taken');
      }
    }

    const updateFields: any = {};

    if (updateData.first_name) updateFields.first_name = updateData.first_name;
    if (updateData.last_name) updateFields.last_name = updateData.last_name;
    if (updateData.email) updateFields.email = updateData.email;
    if (updateData.date_of_birth)
      updateFields.date_of_birth = new Date(updateData.date_of_birth);
    if (updateData.gender) updateFields.gender = updateData.gender;
    if (updateData.nationality)
      updateFields.nationality = updateData.nationality;
    if (updateData.passport_number)
      updateFields.passport_number = updateData.passport_number;
    if (updateData.home_country)
      updateFields.home_country = updateData.home_country;
    if (updateData.home_city) updateFields.home_city = updateData.home_city;

    const updatedTraveler = await this.travelerRepo.updateById(
      travelerId,
      updateFields,
    );

    // Remove sensitive fields
    delete updatedTraveler.password_hash;

    return updatedTraveler;
  }
}
