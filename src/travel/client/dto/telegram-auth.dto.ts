import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class TelegramAuthDto {
  @ApiProperty({ description: 'Telegram user ID' })
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'Telegram username', required: false })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ description: 'Telegram first name' })
  @IsString()
  first_name: string;

  @ApiProperty({ description: 'Telegram last name', required: false })
  @IsOptional()
  @IsString()
  last_name?: string;

  @ApiProperty({ description: 'Telegram photo URL', required: false })
  @IsOptional()
  @IsString()
  photo_url?: string;

  @ApiProperty({ description: 'Telegram auth date' })
  @IsNumber()
  auth_date: number;

  @ApiProperty({ description: 'Telegram hash for verification' })
  @IsString()
  hash: string;

  @ApiProperty({ description: 'Whether user allows write access', required: false })
  @IsOptional()
  @IsBoolean()
  can_write_after_pending_join?: boolean;
}

export class TelegramUsernameDto {
  @ApiProperty({ description: 'Telegram username (without @)' })
  @IsString()
  username: string;
}

export class TelegramOtpDto {
  @ApiProperty({ description: 'Telegram username (without @)' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'OTP code received via Telegram' })
  @IsString()
  otp_code: string;
}

export class TelegramAuthResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  accessToken: string;

  @ApiProperty({ description: 'JWT refresh token' })
  refreshToken: string;

  @ApiProperty({ description: 'Success status' })
  success: boolean;

  @ApiProperty({ description: 'User information' })
  user: {
    id: number;
    telegram_id: number;
    username?: string;
    first_name: string;
    last_name?: string;
    photo_url?: string;
    email?: string;
    phone_number?: string;
    created_at: string;
    updated_at: string;
  };
}

export class TelegramUserProfileDto {
  @ApiProperty({ description: 'Email address', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ description: 'Phone number', required: false })
  @IsOptional()
  @IsString()
  phone_number?: string;

  @ApiProperty({ description: 'Date of birth (YYYY-MM-DD)', required: false })
  @IsOptional()
  @IsString()
  date_of_birth?: string;

  @ApiProperty({ description: 'Gender', enum: ['male', 'female', 'other'], required: false })
  @IsOptional()
  @IsString()
  gender?: 'male' | 'female' | 'other';

  @ApiProperty({ description: 'Nationality', required: false })
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiProperty({ description: 'Passport number', required: false })
  @IsOptional()
  @IsString()
  passport_number?: string;

  @ApiProperty({ description: 'Home country', required: false })
  @IsOptional()
  @IsString()
  home_country?: string;

  @ApiProperty({ description: 'Home city', required: false })
  @IsOptional()
  @IsString()
  home_city?: string;
}
