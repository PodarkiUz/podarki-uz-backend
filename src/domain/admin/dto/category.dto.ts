import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ICreateCategoryParam } from '../interface/category.interface';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { FilesDto } from './product.dto';
import { Type } from 'class-transformer';

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

  @ApiProperty({ type: FilesDto })
  @ValidateNested()
  @Type(() => FilesDto)
  image: FilesDto;

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

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
