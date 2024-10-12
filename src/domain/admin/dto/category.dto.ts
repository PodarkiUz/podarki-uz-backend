import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ICreateCategoryParam } from '../interface/category.interface';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto implements ICreateCategoryParam {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name_ru: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name_uz: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  avif_image: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  group_id?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  parent_id?: string;
}

export class DeleteCategoryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class UpdateCategoryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name_ru?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name_uz?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  avif_image?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  group_id?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  parent_id?: string;
}
