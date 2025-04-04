import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsNotEmpty,
  IsNumberString,
	IsBoolean,
} from 'class-validator';
import { FileType, StatusEnum } from './enums';
import { PaginationParams } from './interfaces';
import { Transform } from 'class-transformer';

export class FileDto {
  @ApiProperty({ enum: FileType })
  @IsEnum(FileType)
  type: FileType;

  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  size: number;
}

export class RouteDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;
}


export class IncludesDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsBoolean()
  included: boolean;
}

export class LanguageDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  en?: string;

  @ApiProperty()
  @IsString()
  uz: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  ru?: string;
}

export class PaginationDto implements PaginationParams {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  offset?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  status?: StatusEnum[];
}

export class OneByIdDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
