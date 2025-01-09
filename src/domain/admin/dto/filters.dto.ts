import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  ICreateFilterParam,
  ICreateFilterValueParam,
} from '../interface/filters.interface';
import { Type } from 'class-transformer';

export class FilterValueDto {
  @ApiProperty()
  @IsString()
  value_uz: string;

  @ApiProperty()
  @IsString()
  value_ru: string;
}

export class CreateFilterDto implements ICreateFilterParam {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name_ru: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name_uz: string;

  @ApiProperty({ type: FilterValueDto, isArray: true })
  @IsArray()
  @ValidateNested()
  @Type(() => Array<FilterValueDto>)
  values: Array<FilterValueDto>;
}

export class DeleteFilterDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class UpdateFilterDto {
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
}

export class CreateFilterValueDto implements ICreateFilterValueParam {
  @ApiProperty()
  @IsString()
  filter_id: string;

  @ApiProperty({ type: FilterValueDto, isArray: true })
  @IsArray()
  @ValidateNested()
  @Type(() => Array<FilterValueDto>)
  values: Array<FilterValueDto>;
}
