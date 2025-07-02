import { AuthController } from './auth.controller';
import { AuthUserRepo } from './repo/auth-user.repo';
import { AuthorizationJwtGuard } from './guards/authorization.jwt.guard';
import { AuthUserDao } from './repo/auth.repo';
import { AuthService } from './providers/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { SharedModule } from '@shared/shared.module';
import { Module } from '@nestjs/common';
import { OrganizerRepo } from 'src/travel/shared/repo/organizer.repo';
import { TravelerController } from './traveler.controller';
import { TravelerService } from './traveler.service';
import { TravelerAuthGuard } from './guards/traveler-auth.guard';
import {
  TravelerRepo,
  PhoneVerificationCodeRepo,
} from '../../shared/repo/traveler.repo';
import { GoogleOAuthService } from './google-oauth.service';
import { GoogleOAuthConfig } from './google-oauth.config';

// Traveler Auth
import { TravelerAuthController } from './traveler-auth.controller';
import { TravelerAuthService } from './providers/traveler-auth.service';
import { PhoneVerificationRepo } from './repo/phone-verification.repo';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { TravelerSessionRepo } from './repo/traveler-session.repo';

@Module({
  imports: [
    SharedModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'NO_SECRET_JWT',
      signOptions: {
        expiresIn: '23h',
      },
    }),
  ],
  controllers: [AuthController, TravelerAuthController, TravelerController],
  providers: [
    JwtService,
    AuthService,
    AuthUserDao,
    AuthorizationJwtGuard,
    AuthUserRepo,
    OrganizerRepo,
    // Traveler components
    TravelerService,
    TravelerAuthGuard,
    PhoneVerificationCodeRepo,
    TravelerRepo,
    TravelerSessionRepo,
    // Google OAuth service
    GoogleOAuthService,
    GoogleOAuthConfig,

    // Traveler Auth
    TravelerAuthService,
    PhoneVerificationRepo,
    JwtAuthGuard,
  ],
  exports: [
    AuthService,
    AuthUserDao,
    AuthorizationJwtGuard,
    JwtService,
    AuthUserRepo,
    // Export traveler components
    TravelerService,
    TravelerAuthGuard,
    TravelerRepo,
    PhoneVerificationCodeRepo,
    TravelerSessionRepo,
    // Export Google OAuth service
    GoogleOAuthService,
    GoogleOAuthConfig,

    // Traveler Auth
    TravelerAuthService,
    PhoneVerificationRepo,
    JwtAuthGuard,
  ],
})
export class AuthModule {}
