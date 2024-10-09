import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPhoneNumber, IsString, MaxLength } from 'class-validator';

export class AuthorizeDto {
  @ApiProperty()
  @IsString()
  username: string;
  @IsString()
  @ApiProperty()
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  refreshToken: string;
}

export class ClientAuthorizeDto {
  @ApiProperty()
  @IsPhoneNumber('UZ')
  phone: string;
}

export class ClientConfirmOTPDto extends ClientAuthorizeDto {
  @ApiProperty()
  @IsString()
  @MaxLength(5)
  otpCode: string;
}
