import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsOptional,
  IsDateString,
  IsEnum,
  MinLength,
  MaxLength,
  IsObject,
} from 'class-validator';

export class TravelerSignUpDto {
  @ApiProperty({ description: 'Phone number for authentication' })
  @IsPhoneNumber('UZ')
  phone_number: string;

  @ApiProperty({ description: 'First name', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  first_name?: string;

  @ApiProperty({ description: 'Last name', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  last_name?: string;

  @ApiProperty({ description: 'Email address', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Password for phone authentication',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}

export class TravelerSignInDto {
  @ApiProperty({ description: 'Phone number' })
  @IsPhoneNumber('UZ')
  phone_number: string;

  @ApiProperty({ description: 'Password for authentication' })
  @IsString()
  password: string;
}

export class TravelerGoogleAuthDto {
  @ApiProperty({ description: 'Google OAuth ID token' })
  @IsString()
  id_token: string;

  @ApiProperty({ description: 'Device information', required: false })
  @IsOptional()
  @IsObject()
  device_info?: any;
}

export class PhoneVerificationDto {
  @ApiProperty({ description: 'Phone number to verify' })
  @IsPhoneNumber('UZ')
  phone_number: string;
}

export class VerifyPhoneCodeDto {
  @ApiProperty({ description: 'Phone number' })
  @IsPhoneNumber('UZ')
  phone_number: string;

  @ApiProperty({ description: 'Verification code' })
  @IsString()
  @MaxLength(6)
  code: string;
}

export class CreateTravelerDto {
  @ApiProperty({ description: 'Phone number', required: true })
  @IsPhoneNumber('UZ')
  phone_number: string;

  @ApiProperty({ description: 'First name', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  first_name?: string;

  @ApiProperty({ description: 'Last name', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  last_name?: string;

  @ApiProperty({ description: 'Email address', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Avatar URL', required: false })
  @IsOptional()
  @IsString()
  avatar_url?: string;

  @ApiProperty({ description: 'Date of birth', required: false })
  @IsOptional()
  @IsDateString()
  date_of_birth?: string;

  @ApiProperty({
    description: 'Gender',
    enum: ['male', 'female', 'other'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['male', 'female', 'other'])
  gender?: 'male' | 'female' | 'other';

  @ApiProperty({ description: 'Nationality', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nationality?: string;

  @ApiProperty({ description: 'Passport number', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  passport_number?: string;

  @ApiProperty({ description: 'Preferred language', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  preferred_language?: string;

  @ApiProperty({ description: 'Timezone', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  timezone?: string;

  @ApiProperty({ description: 'Current location', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  current_location?: string;

  @ApiProperty({ description: 'Home country', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  home_country?: string;

  @ApiProperty({ description: 'Home city', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  home_city?: string;
}

export class UpdateTravelerDto extends PartialType(CreateTravelerDto) {
  @ApiProperty({ description: 'Traveler ID', required: true })
  @IsString()
  id: string;
}

export class ChangePasswordDto {
  @ApiProperty({ description: 'Current password' })
  @IsString()
  current_password: string;

  @ApiProperty({ description: 'New password' })
  @IsString()
  @MinLength(6)
  new_password: string;
}

export class RefreshTokenDto {
  @ApiProperty({ description: 'Refresh token' })
  @IsString()
  refresh_token: string;
}

export class LogoutDto {
  @ApiProperty({ description: 'Session ID to logout from', required: false })
  @IsOptional()
  @IsString()
  session_id?: string;
}
