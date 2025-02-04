import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { IOrganizerCreateParam } from '../interface/admin.interface';
import { FileDto, LanguageDto } from 'src/travel/shared/dtos';

export class CreateOrganizerDto implements IOrganizerCreateParam {
  @ApiProperty({ type: LanguageDto })
  @ValidateNested()
  @Type(() => LanguageDto)
  title: LanguageDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description_uz?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description_ru?: string;

  @ApiPropertyOptional({ type: [FileDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileDto)
  files?: FileDto[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone: string;
}

export class UpdateOrganizerDto extends PartialType(CreateOrganizerDto) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
