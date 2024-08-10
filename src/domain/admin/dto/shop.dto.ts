import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateShopDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  avif_image: string;

  @ApiProperty()
  @IsString()
  small_image: string;

  @ApiProperty()
  @IsString()
  login: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class UpdateShopDto extends PartialType(CreateShopDto) {
  @ApiProperty()
  @IsString()
  id: string;
}

export class UpdateShopByCabinetDto extends PartialType(
  OmitType(CreateShopDto, ['password', 'login']),
) {}
