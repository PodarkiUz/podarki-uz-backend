import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ICreateReasonParam } from '../interface/reason.interface';
import { FilesDto } from './product.dto';
import { Type } from 'class-transformer';

export class CreateReasonDto implements ICreateReasonParam {
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

  @ApiProperty({ type: FilesDto })
  @ValidateNested()
  @Type(() => FilesDto)
  image: FilesDto;
}

export class DeleteReasonDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class UpdateReasonDto {
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
}
