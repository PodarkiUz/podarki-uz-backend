import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

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
