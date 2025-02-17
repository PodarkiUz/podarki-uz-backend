import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsISO8601,
  IsEnum,
  Min,
  ValidateNested,
  IsArray,
} from 'class-validator';
import {
  ITourCreateParam,
  ITourSeachByName,
} from '../interface/tour.interface';
import { FileDto, LanguageDto } from 'src/travel/shared/dtos';
import { Type } from 'class-transformer';
import { OrganizerStatus } from 'src/travel/shared/enums';

export class CreateTourDto implements ITourCreateParam {
  @ApiProperty({ type: LanguageDto })
  @ValidateNested()
  @Type(() => LanguageDto)
  title: LanguageDto;

  @ApiProperty({ type: LanguageDto })
  @ValidateNested()
  @Type(() => LanguageDto)
  description: LanguageDto;

  @ApiProperty({ enum: OrganizerStatus })
  @IsEnum(OrganizerStatus)
  status: OrganizerStatus;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  location: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  price: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  sale_price?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  duration?: string;

  @ApiProperty()
  @IsString()
  @IsISO8601()
  start_date: string;

  @ApiProperty()
  @IsString()
  @IsISO8601()
  end_date: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  organizer_id: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  seats: number;

  @ApiPropertyOptional({ type: [FileDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileDto)
  files?: FileDto[];
}

export class UpdateTourDto extends PartialType(CreateTourDto) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class SearchTourByNameDto implements ITourSeachByName {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  keyword?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  location?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  from_price?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  to_price?: number;

  @ApiPropertyOptional()
  @IsISO8601()
  @IsOptional()
  from_date?: string;

  @ApiPropertyOptional()
  @IsISO8601()
  @IsOptional()
  to_date?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  seats?: number;
}
