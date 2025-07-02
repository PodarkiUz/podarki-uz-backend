import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString, MaxLength, MinLength } from 'class-validator';

export enum AuthProvider {
  PHONE = 'phone',
  GOOGLE = 'google',
}

export class TravelerPhoneAuthDto {
  @ApiProperty({ description: 'Phone number for authentication' })
  @IsPhoneNumber('UZ')
  phone_number: string;
}

export class TravelerConfirmOtpDto {
  @ApiProperty({ description: 'Phone number' })
  @IsPhoneNumber('UZ')
  phone_number: string;

  @ApiProperty({ description: 'OTP code received via SMS' })
  @IsString()
  @MaxLength(6)
  @MinLength(6)
  otp_code: string;
}

export class TravelerGoogleAuthDto {
  @ApiProperty({ description: 'Google ID token or access token' })
  @IsString()
  token: string;

  @ApiProperty({ description: 'Type of token (id_token or access_token)', enum: ['id_token', 'access_token'] })
  @IsEnum(['id_token', 'access_token'])
  token_type: 'id_token' | 'access_token';
}

export class TravelerSignUpDto {
  @ApiProperty({ description: 'First name' })
  @IsString()
  @MaxLength(255)
  first_name: string;

  @ApiProperty({ description: 'Last name' })
  @IsString()
  @MaxLength(255)
  last_name: string;

  @ApiProperty({ description: 'Email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Phone number' })
  @IsPhoneNumber('UZ')
  phone_number: string;

  @ApiProperty({ description: 'Date of birth (YYYY-MM-DD)', required: false })
  @IsOptional()
  @IsString()
  date_of_birth?: string;

  @ApiProperty({ description: 'Gender', enum: ['male', 'female', 'other'], required: false })
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

export class TravelerSignInDto {
  @ApiProperty({ description: 'Authentication provider', enum: AuthProvider })
  @IsEnum(AuthProvider)
  provider: AuthProvider;

  @ApiProperty({ description: 'Phone number (required for phone auth)' })
  @IsOptional()
  @IsPhoneNumber('UZ')
  phone_number?: string;

  @ApiProperty({ description: 'Google token (required for Google auth)' })
  @IsOptional()
  @IsString()
  google_token?: string;

  @ApiProperty({ description: 'Google token type (required for Google auth)' })
  @IsOptional()
  @IsEnum(['id_token', 'access_token'])
  google_token_type?: 'id_token' | 'access_token';
}

export class TravelerRefreshTokenDto {
  @ApiProperty({ description: 'Refresh token' })
  @IsString()
  refresh_token: string;
}

export class TravelerLogoutDto {
  @ApiProperty({ description: 'Access token to invalidate' })
  @IsString()
  access_token: string;
} 