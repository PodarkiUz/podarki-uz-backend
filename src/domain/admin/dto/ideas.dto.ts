import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ICreateIdeasParam } from '../interface/ideas.interface';
import { FilesDto } from './product.dto';
import { Type } from 'class-transformer';

export class CreateIdeasFilterDto {
  @ApiProperty()
  @IsString()
  idea_id: string;

  @ApiProperty()
  @IsString()
  filter_value_id: string;
}

export class CreateIdeasFilterPropDto {
  @ApiProperty()
  @IsString()
  filter_id: string;

  @ApiProperty()
  @IsString({ each: true })
  @IsArray()
  values: string[];
}

export class CreateIdeasDto implements ICreateIdeasParam {
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  group_id?: string;

  @ApiProperty({ type: FilesDto })
  @ValidateNested()
  @Type(() => FilesDto)
  image: FilesDto;

  @ApiProperty({ type: CreateIdeasFilterPropDto, isArray: true })
  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => Array<CreateIdeasFilterPropDto>)
  filters?: CreateIdeasFilterPropDto[];

  @ApiProperty()
  @IsArray()
  @IsString()
  category_ids: string[];
}

export class DeleteIdeasDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class UpdateIdeasDto {
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
  description_uz?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description_ru?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  group_id?: string;
}
