import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TravelerService } from './traveler.service';
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
  LogoutDto,
} from './dto/traveler.dto';
import { TravelerAuthGuard } from './guards/traveler-auth.guard';
import { OneByIdDto } from 'src/travel/shared/dtos';

@ApiTags('TRAVELER')
@Controller('traveler')
export class TravelerController {
  constructor(private readonly travelerService: TravelerService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign up a new traveler' })
  @ApiResponse({ status: 201, description: 'Traveler created successfully' })
  @ApiResponse({ status: 409, description: 'Traveler already exists' })
  async signUp(@Body() signUpDto: TravelerSignUpDto, @Request() req: any) {
    const deviceInfo = req.headers['user-agent'];
    const ipAddress = req.ip || req.connection.remoteAddress;

    return this.travelerService.signUp(signUpDto, deviceInfo, ipAddress);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in traveler with phone and password' })
  @ApiResponse({ status: 200, description: 'Sign in successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async signIn(@Body() signInDto: TravelerSignInDto, @Request() req: any) {
    const deviceInfo = req.headers['user-agent'];
    const ipAddress = req.ip || req.connection.remoteAddress;

    return this.travelerService.signIn(signInDto, deviceInfo, ipAddress);
  }

  @Post('google-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate with Google OAuth' })
  @ApiResponse({ status: 200, description: 'Google authentication successful' })
  @ApiResponse({ status: 401, description: 'Invalid Google token' })
  async googleAuth(
    @Body() googleAuthDto: TravelerGoogleAuthDto,
    @Request() req: any,
  ) {
    const deviceInfo = req.headers['user-agent'];
    const ipAddress = req.ip || req.connection.remoteAddress;

    return this.travelerService.googleAuth(
      googleAuthDto,
      deviceInfo,
      ipAddress,
    );
  }

  @Post('send-verification-code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send phone verification code' })
  @ApiResponse({ status: 200, description: 'Verification code sent' })
  async sendPhoneVerificationCode(
    @Body() verificationDto: PhoneVerificationDto,
  ) {
    return this.travelerService.sendPhoneVerificationCode(verificationDto);
  }

  @Post('verify-phone-code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify phone number with code' })
  @ApiResponse({ status: 200, description: 'Phone number verified' })
  @ApiResponse({ status: 400, description: 'Invalid verification code' })
  async verifyPhoneCode(@Body() verifyDto: VerifyPhoneCodeDto) {
    return this.travelerService.verifyPhoneCode(verifyDto);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.travelerService.refreshToken(refreshTokenDto);
  }

  @Post('logout')
  @UseGuards(TravelerAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout traveler' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  async logout(@Request() req: any, @Body() logoutDto: LogoutDto) {
    return this.travelerService.logout(req.user.sub, logoutDto.session_id);
  }

  @Post('create')
  @UseGuards(TravelerAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new traveler (Admin only)' })
  @ApiResponse({ status: 201, description: 'Traveler created successfully' })
  @ApiResponse({ status: 409, description: 'Traveler already exists' })
  async createTraveler(@Body() createDto: CreateTravelerDto) {
    return this.travelerService.createTraveler(createDto);
  }

  @Post('profile')
  @UseGuards(TravelerAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current traveler profile' })
  @ApiResponse({ status: 200, description: 'Traveler profile retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Request() req: any) {
    return this.travelerService.getTravelerById(req.user.sub);
  }

  @Post('get-by-id')
  @UseGuards(TravelerAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get traveler by ID' })
  @ApiResponse({ status: 200, description: 'Traveler retrieved' })
  @ApiResponse({ status: 404, description: 'Traveler not found' })
  async getTravelerById(@Body() params: OneByIdDto) {
    return this.travelerService.getTravelerById(params.id);
  }

  @Post('update-profile')
  @UseGuards(TravelerAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current traveler profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 404, description: 'Traveler not found' })
  async updateProfile(
    @Request() req: any,
    @Body() updateDto: UpdateTravelerDto,
  ) {
    return this.travelerService.updateTraveler(req.user.sub, updateDto);
  }

  @Post('update-by-id')
  @UseGuards(TravelerAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update traveler by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Traveler updated successfully' })
  @ApiResponse({ status: 404, description: 'Traveler not found' })
  async updateTraveler(
    @Body() params: OneByIdDto,
    @Body() updateDto: UpdateTravelerDto,
  ) {
    return this.travelerService.updateTraveler(params.id, updateDto);
  }

  @Post('delete-by-id')
  @UseGuards(TravelerAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete traveler by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Traveler deleted successfully' })
  @ApiResponse({ status: 404, description: 'Traveler not found' })
  async deleteTraveler(@Body() params: OneByIdDto) {
    return this.travelerService.deleteTraveler(params.id);
  }

  @Post('change-password')
  @UseGuards(TravelerAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change traveler password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 401, description: 'Current password incorrect' })
  async changePassword(
    @Request() req: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.travelerService.changePassword(req.user.sub, changePasswordDto);
  }
}
