import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';

export class TelegramPhoneDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^(\+998|998|8)?[0-9]{9}$/, {
    message: 'Phone number must be a valid Uzbekistan phone number'
  })
  phoneNumber: string;
}

export class TelegramGatewayOtpDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^(\+998|998|8)?[0-9]{9}$/, {
    message: 'Phone number must be a valid Uzbekistan phone number'
  })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 8, { message: 'OTP code must be between 4 and 8 digits' })
  @Matches(/^[0-9]+$/, { message: 'OTP code must contain only digits' })
  otp_code: string;
}
