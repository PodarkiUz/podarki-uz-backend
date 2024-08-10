import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ListPageDto } from 'src/shared/dto/list.dto';
import { ShopStatusEnum } from '../enum/product.enum';

export class CreateShopDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
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

export class AdminShopListDto extends ListPageDto {
  @ApiPropertyOptional({ enum: ShopStatusEnum })
  @IsEnum(ShopStatusEnum)
  @IsOptional()
  status?: ShopStatusEnum;
}
