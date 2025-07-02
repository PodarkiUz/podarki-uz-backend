import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  TravelerRepo,
  PhoneVerificationCodeRepo,
} from '../../shared/repo/traveler.repo';
import {
  TravelerSignUpDto,
  TravelerSignInDto,
  TravelerGoogleAuthDto,
  PhoneVerificationDto,
  VerifyPhoneCodeDto,
  CreateTravelerDto,
  UpdateTravelerDto,
  ChangePasswordDto,
  RefreshTokenDto,
} from './dto/traveler.dto';
import { TravelerEntity } from '../../shared/repo/traveler.entity';
import { GoogleOAuthService } from './google-oauth.service';
import { TravelerSessionRepo } from './repo/traveler-session.repo';

@Injectable()
export class TravelerService {
  constructor(
    private readonly travelerRepo: TravelerRepo,
    private readonly phoneVerificationRepo: PhoneVerificationCodeRepo,
    private readonly sessionRepo: TravelerSessionRepo,
    private readonly jwtService: JwtService,
    private readonly googleOAuthService: GoogleOAuthService,
  ) {}

  async signUp(
    signUpDto: TravelerSignUpDto,
    deviceInfo?: any,
    ipAddress?: string,
  ) {
    // Check if traveler already exists
    const existingTraveler = await this.travelerRepo.findByPhoneNumber(
      signUpDto.phone_number,
    );
    if (existingTraveler) {
      throw new ConflictException(
        'Traveler with this phone number already exists',
      );
    }

    // Hash password if provided
    let passwordHash: string | undefined;
    if (signUpDto.password) {
      passwordHash = await bcrypt.hash(signUpDto.password, 10);
    }

    // Create traveler
    const travelerData: TravelerEntity = {
      phone_number: signUpDto.phone_number,
      first_name: signUpDto.first_name,
      last_name: signUpDto.last_name,
      email: signUpDto.email,
      password_hash: passwordHash,
      is_phone_verified: false,
      is_email_verified: false,
      is_active: true,
      preferred_language: 'uz',
      timezone: 'Asia/Tashkent',
    };

    const traveler = await this.travelerRepo.insert(travelerData);

    // Generate tokens
    const tokens = await this.generateTokens(
      traveler.id!,
      deviceInfo,
      ipAddress,
    );

    return {
      traveler: this.sanitizeTraveler(traveler),
      ...tokens,
    };
  }

  async signIn(
    signInDto: TravelerSignInDto,
    deviceInfo?: any,
    ipAddress?: string,
  ) {
    const traveler = await this.travelerRepo.findByPhoneNumber(
      signInDto.phone_number,
    );
    if (!traveler) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!traveler.password_hash) {
      throw new UnauthorizedException(
        'Account not set up with password authentication',
      );
    }

    const isPasswordValid = await bcrypt.compare(
      signInDto.password,
      traveler.password_hash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!traveler.is_active) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Update last login
    await this.travelerRepo.updateLastLogin(traveler.id!);

    // Generate tokens
    const tokens = await this.generateTokens(
      traveler.id!,
      deviceInfo,
      ipAddress,
    );

    return {
      traveler: this.sanitizeTraveler(traveler),
      ...tokens,
    };
  }

  async googleAuth(
    googleAuthDto: TravelerGoogleAuthDto,
    deviceInfo?: any,
    ipAddress?: string,
  ) {
    try {
      // Verify Google ID token using the Google OAuth service
      const googleUser = await this.googleOAuthService.verifyIdToken(
        googleAuthDto.id_token,
      );
      console.log(googleUser);
      // Check if traveler exists with this Google ID
      let traveler = await this.travelerRepo.findByGoogleId(googleUser.sub);

      if (!traveler) {
        // Check if traveler exists with this email
        if (googleUser.email) {
          traveler = await this.travelerRepo.findByEmail(googleUser.email);
          if (traveler) {
            // Update existing traveler with Google ID
            await this.travelerRepo.updateById(traveler.id!, {
              google_id: googleUser.sub,
              google_email: googleUser.email,
              is_email_verified: true,
            });
          }
        }

        if (!traveler) {
          // Create new traveler
          const travelerData: TravelerEntity = {
            first_name: googleUser.given_name,
            last_name: googleUser.family_name,
            email: googleUser.email,
            google_id: googleUser.sub,
            google_email: googleUser.email,
            avatar_url: googleUser.picture,
            is_email_verified: true,
            is_active: true,
            preferred_language: 'uz',
            timezone: 'Asia/Tashkent',
            phone_number: '', // Will need to be set later
          };

          traveler = await this.travelerRepo.insert(travelerData);
        }
      }

      if (!traveler.is_active) {
        throw new UnauthorizedException('Account is deactivated');
      }

      // Update last login
      await this.travelerRepo.updateLastLogin(traveler.id!);

      // Generate tokens
      const tokens = await this.generateTokens(
        traveler.id!,
        deviceInfo,
        ipAddress,
      );

      return {
        traveler: this.sanitizeTraveler(traveler),
        ...tokens,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid Google token');
    }
  }

  async sendPhoneVerificationCode(verificationDto: PhoneVerificationDto) {
    const code = this.generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await this.phoneVerificationRepo.createCode(
      verificationDto.phone_number,
      code,
      expiresAt,
    );

    // TODO: Integrate with SMS service to send the code
    console.log(
      `Verification code for ${verificationDto.phone_number}: ${code}`,
    );

    return { message: 'Verification code sent successfully' };
  }

  async verifyPhoneCode(verifyDto: VerifyPhoneCodeDto) {
    const code = await this.phoneVerificationRepo.findValidCode(
      verifyDto.phone_number,
      verifyDto.code,
    );

    if (!code) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    // Mark code as used
    await this.phoneVerificationRepo.markCodeAsUsed(code.id!);

    // Find and verify traveler
    const traveler = await this.travelerRepo.findByPhoneNumber(
      verifyDto.phone_number,
    );
    if (traveler) {
      await this.travelerRepo.verifyPhone(traveler.id!);
    }

    return { message: 'Phone number verified successfully' };
  }

  async createTraveler(createDto: CreateTravelerDto) {
    const existingTraveler = await this.travelerRepo.findByPhoneNumber(
      createDto.phone_number,
    );
    if (existingTraveler) {
      throw new ConflictException(
        'Traveler with this phone number already exists',
      );
    }

    // Convert string date to Date object if provided
    const travelerData: TravelerEntity = {
      ...createDto,
      date_of_birth: createDto.date_of_birth
        ? new Date(createDto.date_of_birth)
        : undefined,
    };

    const traveler = await this.travelerRepo.insert(travelerData);
    return this.sanitizeTraveler(traveler);
  }

  async getTravelerById(id: string) {
    const traveler = await this.travelerRepo.getById(id);
    if (!traveler || traveler.is_deleted) {
      throw new BadRequestException('Traveler not found');
    }
    return this.sanitizeTraveler(traveler);
  }

  async updateTraveler(id: string, updateDto: UpdateTravelerDto) {
    const traveler = await this.travelerRepo.getById(id);
    if (!traveler || traveler.is_deleted) {
      throw new BadRequestException('Traveler not found');
    }

    // Convert string date to Date object if provided
    const updateData: Partial<TravelerEntity> = {
      ...updateDto,
      date_of_birth: updateDto.date_of_birth
        ? new Date(updateDto.date_of_birth)
        : undefined,
    };

    await this.travelerRepo.updateById(id, updateData);
    const updatedTraveler = await this.travelerRepo.getById(id);
    return this.sanitizeTraveler(updatedTraveler);
  }

  async deleteTraveler(id: string) {
    const traveler = await this.travelerRepo.getById(id);
    if (!traveler || traveler.is_deleted) {
      throw new BadRequestException('Traveler not found');
    }

    await this.travelerRepo.delete({ id });
    return { message: 'Traveler deleted successfully' };
  }

  async changePassword(
    travelerId: string,
    changePasswordDto: ChangePasswordDto,
  ) {
    const traveler = await this.travelerRepo.getById(travelerId);
    if (!traveler || !traveler.password_hash) {
      throw new BadRequestException('Password not set for this account');
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      changePasswordDto.current_password,
      traveler.password_hash,
    );

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const newPasswordHash = await bcrypt.hash(
      changePasswordDto.new_password,
      10,
    );
    await this.travelerRepo.updateById(travelerId, {
      password_hash: newPasswordHash,
    });

    return { message: 'Password changed successfully' };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const session = await this.sessionRepo.findByRefreshToken(
      refreshTokenDto.refresh_token,
    );
    if (!session) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (session.expires_at < new Date()) {
      await this.sessionRepo.deleteSession(session.id!);
      throw new UnauthorizedException('Refresh token expired');
    }

    const traveler = await this.travelerRepo.getById(session.traveler_id);
    if (!traveler || !traveler.is_active) {
      throw new UnauthorizedException('Traveler not found or inactive');
    }

    // Generate new tokens
    const tokens = await this.generateTokens(
      traveler.id!,
      session.device_info,
      session.ip_address,
    );

    // Delete old session
    await this.sessionRepo.deleteSession(session.id!);

    return tokens;
  }

  async logout(travelerId: string, sessionId?: string) {
    if (sessionId) {
      await this.sessionRepo.deleteSession(sessionId);
    } else {
      await this.sessionRepo.deleteAllSessionsForTraveler(travelerId);
    }

    return { message: 'Logged out successfully' };
  }

  private async generateTokens(
    travelerId: string,
    deviceInfo?: any,
    ipAddress?: string,
  ) {
    const accessToken = this.jwtService.sign(
      { sub: travelerId, type: 'traveler' },
      { expiresIn: '1h', secret: process.env.JWT_SECRET },
    );

    const refreshToken = this.jwtService.sign(
      { sub: travelerId, type: 'traveler_refresh' },
      { expiresIn: '7d', secret: process.env.JWT_SECRET },
    );

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Store session
    await this.sessionRepo.createSession({
      traveler_id: travelerId,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: expiresAt,
      device_info: deviceInfo,
      ip_address: ipAddress,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 3600, // 1 hour
    };
  }

  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private sanitizeTraveler(traveler: TravelerEntity): Partial<TravelerEntity> {
    const { password_hash, ...sanitizedTraveler } = traveler;
    return sanitizedTraveler;
  }
}
