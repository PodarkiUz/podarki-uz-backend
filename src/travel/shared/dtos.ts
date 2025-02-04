import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsString, IsNumber, IsOptional } from 'class-validator';
import { FileType } from './enums';

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
