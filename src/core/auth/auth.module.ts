import { AuthController } from './auth.controller';
import { AuthUserRepo } from './repo/auth-user.repo';
import { AuthorizationJwtGuard } from './guards/authorization.jwt.guard';
import { AuthUserDao } from './repo/auth.repo';
import { AuthService } from './providers/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { SharedModule } from '@shared/shared.module';
import { Module } from '@nestjs/common';
import { ShopRepo } from '@domain/shop/repo/shop.repo';

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
  controllers: [AuthController],
  providers: [
    JwtService,
    AuthService,
    AuthUserDao,
    AuthorizationJwtGuard,
    AuthUserRepo,
    ShopRepo,
  ],
  exports: [
    AuthService,
    AuthUserDao,
    AuthorizationJwtGuard,
    JwtService,
    AuthUserRepo,
  ],
})
export class AuthModule {}
