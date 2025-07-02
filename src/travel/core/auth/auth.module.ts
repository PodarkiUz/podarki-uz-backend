import { AuthController } from './auth.controller';
import { AuthUserRepo } from './repo/auth-user.repo';
import { AuthorizationJwtGuard } from './guards/authorization.jwt.guard';
import { AuthUserDao } from './repo/auth.repo';
import { AuthService } from './providers/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { SharedModule } from '@shared/shared.module';
import { Module } from '@nestjs/common';
import { ShopRepo } from '@domain/shop/repo/shop.repo';
import { OrganizerRepo } from 'src/travel/shared/repo/organizer.repo';
import { TravelerController } from './traveler.controller';
import { TravelerService } from './traveler.service';
import { TravelerAuthGuard } from './guards/traveler-auth.guard';
import {
  TravelerRepo,
  PhoneVerificationCodeRepo,
  TravelerSessionRepo,
} from '../../shared/repo/traveler.repo';

@Module({
  imports: [
    SharedModule,
    JwtModule.register({
      secret: 'super-cat',
      signOptions: {
        expiresIn: '23h',
      },
    }),
  ],
  controllers: [AuthController, TravelerController],
  providers: [
    JwtService,
    AuthService,
    AuthUserDao,
    AuthorizationJwtGuard,
    AuthUserRepo,
    ShopRepo,
    OrganizerRepo,
    // Traveler components
    TravelerService,
    TravelerAuthGuard,
    TravelerRepo,
    PhoneVerificationCodeRepo,
    TravelerSessionRepo,
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
  ],
})
export class AuthModule {}
