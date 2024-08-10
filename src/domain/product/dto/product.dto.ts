import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ListPageDto } from 'src/shared/dto/list.dto';
import { SortType } from '../enum/product.enum';

export class CreateProductByAdminDto {
  @ApiProperty()
  @IsString()
  @MaxLength(64)
  name_uz: string;

  @ApiProperty()
  @IsString()
  @MaxLength(64)
  name_en: string;

  @ApiProperty()
  @IsString()
  @MaxLength(64)
  name_ru: string;

  @ApiProperty()
  @IsString({ each: true })
  @IsArray()
  avif_images: string;

  @ApiProperty()
  @IsString()
  small_image: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  discount_price?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  sub_category_id: string;

  @ApiProperty()
  @IsString()
  shop_id: string;
}

export class UpdateProductByAdminDto extends PartialType(
  CreateProductByAdminDto,
) {
  @ApiProperty()
  @IsString()
  id: string;
}

export class ProductListByCategoryDto extends ListPageDto {
  @ApiProperty()
  @IsString()
  category_id: string;

  @ApiPropertyOptional({ enum: SortType })
  @IsEnum(SortType)
  @IsOptional()
  sort?: SortType;

  @ApiPropertyOptional()
  // @IsNumber()
  @IsOptional()
  from_price?: number;

  @ApiPropertyOptional()
  // @IsNumber()
  @IsOptional()
  to_price?: number;
}

export class SearchDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;
}
