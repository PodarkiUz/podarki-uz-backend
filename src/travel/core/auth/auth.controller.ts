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
import { ErrorResponseDto } from './swagger';
import { LoginResponseDto } from './swagger';

@ApiTags('TRAVEL AUTH')
@Controller('auth')
export class AuthController {
  @Inject() authService: AuthService;
  @Inject() usersRepo: AuthUserRepo;

  @ApiBody({
    type: RefreshTokenDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Example response',
    type: () => LoginResponseDto, // Define your DTO (Data Transfer Object) for the response
  })
  @ApiResponse({
    status: 400,
    description: 'Example error response',
    type: () => ErrorResponseDto, // Define your DTO (Data Transfer Object) for the response
  })
  @Post('refreshToken')
  async refresh(@CurrentUser() user, @Body() body: RefreshTokenDto) {
    return await this.authService.refreshToken(body.refreshToken);
  }

  @ApiBody({
    type: ClientAuthorizeDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Example response',
    type: () => LoginResponseDto, // Define your DTO (Data Transfer Object) for the response
  })
  @ApiResponse({
    status: 400,
    description: 'Example error response',
    type: () => ErrorResponseDto, // Define your DTO (Data Transfer Object) for the response
  })
  @Post('client/login')
  async clientLogin(@Ip() ip: string, @Body() body: ClientAuthorizeDto) {
    // throw new Error();
    return await this.authService.clientAuthorize(body);
  }

  @ApiBody({
    type: ClientConfirmOTPDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Example response',
    type: () => LoginResponseDto, // Define your DTO (Data Transfer Object) for the response
  })
  @ApiResponse({
    status: 400,
    description: 'Example error response',
    type: () => ErrorResponseDto, // Define your DTO (Data Transfer Object) for the response
  })
  @Post('client/confirm-otp')
  async confirmOtp(@Body() body: ClientConfirmOTPDto) {
    // throw Error();
    return await this.authService.confirmOtp(body.phone, body.otpCode);
  }

  @ApiBody({
    type: AuthorizeDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Example response',
    type: () => LoginResponseDto, // Define your DTO (Data Transfer Object) for the response
  })
  @ApiResponse({
    status: 400,
    description: 'Example error response',
    type: () => ErrorResponseDto, // Define your DTO (Data Transfer Object) for the response
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
