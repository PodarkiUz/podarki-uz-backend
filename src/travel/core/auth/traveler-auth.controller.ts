import {
  Body,
  Controller,
  Delete,
  Get,
  Ip,
  Param,
  Post,
  Put,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TravelerAuthService } from './providers/traveler-auth.service';
import {
  TravelerPhoneAuthDto,
  TravelerConfirmOtpDto,
  TravelerGoogleAuthDto,
  TravelerSignUpDto,
  TravelerSignInDto,
  TravelerRefreshTokenDto,
  TravelerLogoutDto,
} from './dto/traveler-auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '@decorator/current-user.decorator';

@ApiTags('TRAVELER AUTH')
@Controller('traveler/auth')
export class TravelerAuthController {
  constructor(private readonly travelerAuthService: TravelerAuthService) { }

  @ApiBody({ type: TravelerPhoneAuthDto })
  @ApiResponse({
    status: 200,
    description: 'Verification code sent successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @Post('send-verification')
  async sendPhoneVerification(
    @Body() body: TravelerPhoneAuthDto,
    @Ip() ip: string,
  ) {
    return await this.travelerAuthService.sendPhoneVerification(body);
  }

  @ApiBody({ type: TravelerConfirmOtpDto })
  @ApiResponse({
    status: 200,
    description: 'Phone number verified successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid or expired verification code',
  })
  @Post('verify-phone')
  async verifyPhoneOtp(@Body() body: TravelerConfirmOtpDto) {
    return await this.travelerAuthService.verifyPhoneOtp(body);
  }

  @ApiBody({ type: TravelerSignUpDto })
  @ApiResponse({
    status: 201,
    description: 'Traveler registered successfully',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
        success: { type: 'boolean' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'User already exists or invalid data',
  })
  @Post('signup')
  async signUp(@Body() body: TravelerSignUpDto) {
    return await this.travelerAuthService.signUpWithPhone(body);
  }

  @ApiBody({ type: TravelerSignInDto })
  @ApiResponse({
    status: 200,
    description: 'Traveler signed in successfully',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
        success: { type: 'boolean' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  @ApiResponse({
    status: 404,
    description: 'Traveler not found',
  })
  @Post('signin')
  async signIn(@Body() body: TravelerSignInDto) {
    return await this.travelerAuthService.signIn(body);
  }

  @ApiBody({ type: TravelerGoogleAuthDto })
  @ApiResponse({
    status: 200,
    description: 'Google authentication successful',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
        success: { type: 'boolean' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid Google token',
  })
  @Post('google')
  async googleAuth(@Body() body: TravelerGoogleAuthDto) {
    return await this.travelerAuthService.signInWithGoogle(body);
  }

  @ApiBody({ type: TravelerRefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
        success: { type: 'boolean' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid refresh token',
  })
  @Post('refresh')
  async refreshToken(@Body() body: TravelerRefreshTokenDto) {
    return await this.travelerAuthService.refreshToken(body.refresh_token);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Logged out successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  @Post('logout')
  async logout(@Body() body: TravelerLogoutDto) {
    return await this.travelerAuthService.logout(body.access_token);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Traveler profile retrieved successfully',
  })
  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    return await this.travelerAuthService.getProfile(user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: TravelerSignUpDto })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
  })
  @Put('profile')
  async updateProfile(
    @CurrentUser() user: any,
    @Body() body: Partial<TravelerSignUpDto>,
  ) {
    return await this.travelerAuthService.updateProfile(user.id, body);
  }
}

@ApiTags('TRAVELER MANAGEMENT')
@Controller('travelers')
export class TravelerController {
  constructor(private readonly travelerAuthService: TravelerAuthService) { }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'List of travelers retrieved successfully',
  })
  @Get()
  async getAllTravelers(
    @Query('limit') limit: number = 50,
    @Query('offset') offset: number = 0,
    @Query('search') search?: string,
  ) {
    // This would typically be in a separate service for admin operations
    // For now, we'll use the repository directly
    const travelerRepo = (this.travelerAuthService as any).travelerRepo;

    if (search) {
      return await travelerRepo.search(search, limit, offset);
    }

    return await travelerRepo.getAll(limit, offset);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Traveler retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Traveler not found',
  })
  @Get(':id')
  async getTravelerById(@Param('id') id: string) {
    const travelerRepo = (this.travelerAuthService as any).travelerRepo;
    const traveler = await travelerRepo.getById(id);

    if (!traveler) {
      throw new Error('Traveler not found');
    }

    return traveler;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Traveler activated successfully',
  })
  @Post(':id/activate')
  async activateTraveler(@Param('id') id: string) {
    const travelerRepo = (this.travelerAuthService as any).travelerRepo;
    return await travelerRepo.activateAccount(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Traveler deactivated successfully',
  })
  @Post(':id/deactivate')
  async deactivateTraveler(@Param('id') id: string) {
    const travelerRepo = (this.travelerAuthService as any).travelerRepo;
    return await travelerRepo.deactivateAccount(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Traveler deleted successfully',
  })
  @Delete(':id')
  async deleteTraveler(@Param('id') id: string) {
    const travelerRepo = (this.travelerAuthService as any).travelerRepo;
    return await travelerRepo.deleteById(id);
  }
} 