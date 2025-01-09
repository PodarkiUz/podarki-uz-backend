import { FilesDto, ShopBannerFilesDto } from '@domain/admin/dto/product.dto';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { IShopCreateParam } from '../interface/shop.interface';

export class CreateShopDto implements IShopCreateParam {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description_uz?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description_ru?: string;

  @ApiProperty({ type: FilesDto })
  @ValidateNested()
  @Type(() => FilesDto)
  image: FilesDto;

  @ApiPropertyOptional({ type: ShopBannerFilesDto })
  @ValidateNested()
  @Type(() => ShopBannerFilesDto)
  @IsOptional()
  banner_image?: ShopBannerFilesDto;
}

export class UpdateShopDto extends PartialType(CreateShopDto) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
