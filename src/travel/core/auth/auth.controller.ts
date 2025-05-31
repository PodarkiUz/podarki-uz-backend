import { Body, Controller, Inject, Ip, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './providers/auth.service';
import {
  AuthorizeDto,
  ClientAuthorizeDto,
  ClientConfirmOTPDto,
  CreateHashDto,
  RefreshTokenDto,
} from './dto/authorize.dto';
import { AuthUserRepo } from './repo/auth-user.repo';
import { CurrentUser } from '@decorator/current-user.decorator';

@ApiTags('TRAVEL AUTH')
@Controller('auth')
export class AuthController {
  @Inject() authService: AuthService;
  @Inject() usersRepo: AuthUserRepo;

  @ApiBody({
    type: RefreshTokenDto,
  })
  @Post('refreshToken')
  async refresh(@CurrentUser() user, @Body() body: RefreshTokenDto) {
    return await this.authService.refreshToken(body.refreshToken);
  }

  @ApiBody({
    type: ClientAuthorizeDto,
  })
  @Post('client/login')
  async clientLogin(@Ip() ip: string, @Body() body: ClientAuthorizeDto) {
    // throw new Error();
    return await this.authService.clientAuthorize(body);
  }

  @ApiBody({
    type: ClientConfirmOTPDto,
  })
  @Post('client/confirm-otp')
  async confirmOtp(@Body() body: ClientConfirmOTPDto) {
    // throw Error();
    return await this.authService.confirmOtp(body.phone, body.otpCode);
  }

  @ApiBody({
    type: AuthorizeDto,
  })
  @Post('admin/login')
  async shopLogin(@Ip() ip: string, @Body() body: AuthorizeDto) {
    return await this.authService.organizerAuthorize(body);
  }

  @Post('admin/create-hash')
  generatePassword(@Body() body: CreateHashDto) {
    return this.authService.generatePasswordHash(body.password);
  }
}
