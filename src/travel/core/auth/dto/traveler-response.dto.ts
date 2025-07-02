import { ApiProperty } from '@nestjs/swagger';

export class TravelerTokenResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  accessToken: string;

  @ApiProperty({ description: 'JWT refresh token' })
  refreshToken: string;

  @ApiProperty({ description: 'Success status' })
  success: boolean;
}

export class TravelerMessageResponseDto {
  @ApiProperty({ description: 'Success status' })
  success: boolean;

  @ApiProperty({ description: 'Response message' })
  message: string;
}

export class TravelerProfileDto {
  @ApiProperty({ description: 'Traveler ID' })
  id: string;

  @ApiProperty({ description: 'First name' })
  first_name: string;

  @ApiProperty({ description: 'Last name' })
  last_name: string;

  @ApiProperty({ description: 'Email address' })
  email: string;

  @ApiProperty({ description: 'Phone number' })
  phone_number: string;

  @ApiProperty({ description: 'Date of birth' })
  date_of_birth?: string;

  @ApiProperty({ description: 'Gender', enum: ['male', 'female', 'other'] })
  gender?: 'male' | 'female' | 'other';

  @ApiProperty({ description: 'Nationality' })
  nationality?: string;

  @ApiProperty({ description: 'Passport number' })
  passport_number?: string;

  @ApiProperty({ description: 'Avatar URL' })
  avatar_url?: string;

  @ApiProperty({ description: 'Home country' })
  home_country?: string;

  @ApiProperty({ description: 'Home city' })
  home_city?: string;

  @ApiProperty({ description: 'Phone verification status' })
  is_phone_verified: boolean;

  @ApiProperty({ description: 'Email verification status' })
  is_email_verified: boolean;

  @ApiProperty({ description: 'Account active status' })
  is_active: boolean;

  @ApiProperty({ description: 'Preferred language' })
  preferred_language: string;

  @ApiProperty({ description: 'Timezone' })
  timezone: string;

  @ApiProperty({ description: 'Last login timestamp' })
  last_login_at?: string;

  @ApiProperty({ description: 'Account creation timestamp' })
  created_at: string;

  @ApiProperty({ description: 'Last update timestamp' })
  updated_at: string;
}

export class TravelerListResponseDto {
  @ApiProperty({ description: 'List of travelers', type: [TravelerProfileDto] })
  data: TravelerProfileDto[];

  @ApiProperty({ description: 'Total count' })
  total: number;

  @ApiProperty({ description: 'Current page limit' })
  limit: number;

  @ApiProperty({ description: 'Current page offset' })
  offset: number;
} 