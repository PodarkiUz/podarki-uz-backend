export interface TravelerEntity {
  id?: string;
  created_at?: Date;
  updated_at?: Date;
  is_deleted?: boolean;

  // Basic user information
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;

  // Authentication fields
  password_hash?: string;
  google_id?: string;
  google_email?: string;
  telegram_id?: number;
  auth_provider?: 'phone' | 'google' | 'telegram' | 'telegram_gateway';
  tg_username?: string;

  // Profile information
  avatar_url?: string;
  photo_url?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  nationality?: string;
  passport_number?: string;

  // Verification and status
  is_phone_verified?: boolean;
  is_email_verified?: boolean;
  is_active?: boolean;
  last_login_at?: Date;

  // Preferences
  preferred_language?: string;
  timezone?: string;

  // Location
  current_location?: string;
  home_country?: string;
  home_city?: string;
}

export interface PhoneVerificationCodeEntity {
  id?: string;
  created_at?: Date;
  expires_at: Date;
  is_deleted?: boolean;

  phone_number: string;
  code: string;
  is_used?: boolean;
  attempts?: number;
}

export interface TravelerSessionEntity {
  id?: string;
  created_at?: Date;
  expires_at: Date;
  is_deleted?: boolean;

  traveler_id: string;
  access_token: string;
  refresh_token?: string;
  device_info?: any;
  ip_address?: string;
}

export interface TravelerTokenEntity {
  id?: string;
  created_at?: Date;
  expires_at: Date;
  is_deleted?: boolean;

  traveler_id: string;
  token: string;
  type: 'access' | 'refresh';
}
