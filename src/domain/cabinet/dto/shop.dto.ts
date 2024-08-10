import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ShopLoginDto {
  @ApiProperty()
  @IsString()
  login: string;

  @ApiProperty()
  @IsString()
  password: string;
}
