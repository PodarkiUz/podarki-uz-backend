import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ICreateProductParam } from '../interface/product.interface';
import { FilesEntity } from '../entity/product.entity';
import { Type } from 'class-transformer';

export class FilesDto implements FilesEntity {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  imageOriginal: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  image256x256: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  image64x64: string;
}

export class CreateProductDto implements ICreateProductParam {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name_ru: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name_uz: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description_uz?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description_ru?: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  sale_price?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category_id?: string;

  @ApiProperty({ type: FilesDto, isArray: true })
  @IsArray()
  @ValidateNested()
  @Type(() => Array<FilesDto>)
  files: FilesDto[];
}

export class DeleteProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class CreateProductFilterDto {
  @ApiProperty()
  @IsString()
  product_id: string;

  @ApiProperty()
  @IsString()
  filter_value_id: string;
}

export class GetProductsByIdeaDto {
  @ApiProperty()
  @IsString()
  idea_id: string;
}

export class GetProductsByCategoryDto {
  @ApiProperty()
  @IsString()
  category_id: string;
}
