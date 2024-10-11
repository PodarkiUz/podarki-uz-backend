import {
  ErrorResponseDto,
  LoginResponseDto,
  MeResponseDto,
} from '@auth/swagger';
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  Ip,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './providers/auth.service';
import {
  AuthorizeDto,
  ClientAuthorizeDto,
  ClientConfirmOTPDto,
  RefreshTokenDto,
} from './dto/authorize.dto';
import { AuthorizationJwtGuard } from './guards/authorization.jwt.guard';
import { ICurrentUser } from '@shared/interfaces/current-user';
import { AuthUserRepo } from './repo/auth-user.repo';
import { CurrentUser } from '@decorator/current-user.decorator';

@ApiTags('AUTH')
@Controller()
export class AuthController {
  @Inject() authService: AuthService;
  @Inject() usersRepo: AuthUserRepo;

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
  @Post('login')
  async login(@Ip() ip: string, @Body() body: AuthorizeDto) {
    const user = await this.authService.checkUser(body.username, body.password);
    if (!user) {
      throw new HttpException('ERROR_USER_DOESNT_EXISTS', 400);
    }

    const token = await this.authService.createToken(user);
    if (!token) {
      throw new HttpException(
        'ERROR_WHILE_CREATING_TOKEN',
        HttpStatus.BAD_REQUEST,
      );
    }
    return token;
  }

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

  @ApiBearerAuth('authorization')
  @UseGuards(AuthorizationJwtGuard)
  @ApiResponse({
    status: 200,
    description: 'Example response',
    type: () => MeResponseDto, // Define your DTO (Data Transfer Object) for the response
  })
  @ApiResponse({
    status: 400,
    description: 'Example error response',
    type: () => ErrorResponseDto, // Define your DTO (Data Transfer Object) for the response
  })
  @Post('me')
  currentUser(@CurrentUser() user) {
    return user;
  }

  @ApiBearerAuth('authorization')
  @UseGuards(AuthorizationJwtGuard)
  @Post('logout')
  async logout(@CurrentUser() user: ICurrentUser) {
    await this.authService.logout(user.id);
    return;
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
  @Post('shop/login')
  async shopLogin(@Ip() ip: string, @Body() body: ClientAuthorizeDto) {
    // throw new Error();
    return await this.authService.clientAuthorize(body);
  }
}
