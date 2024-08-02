import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, MaxLength } from 'class-validator';
import { ProductStatusEnum } from '../enum/product.enum';

export class SetUserStatusDto {
  @ApiProperty()
  @IsString()
  user_id: string;

  @ApiProperty()
  @IsEnum(ProductStatusEnum)
  status: ProductStatusEnum;
}

export class AdminSignInDto {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class CreateAdminDto {
  @ApiProperty()
  @IsString()
  @MaxLength(16)
  password: string;

  @ApiProperty()
  @IsString()
  @MaxLength(24)
  username: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  first_name: string;

  @ApiProperty()
  @IsString()
  last_name: string;
}
