import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsISO8601,
  IsEnum,
  ValidateNested,
  IsArray,
  IsNumberString,
} from 'class-validator';
import {
  ITourCreateParam,
  ITourSeachByName,
} from '../interface/tour.interface';
import {
  FileDto,
  IncludesDto,
  LanguageDto,
  RouteDto,
} from 'src/travel/shared/dtos';
import { Type } from 'class-transformer';
import { CurrencyType, OrganizerStatus } from 'src/travel/shared/enums';

export class TourDetailsDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  tour_type?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  difficulty?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  start_location?: string;
}

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
  @IsNumberString()
  @IsNotEmpty()
  price: number;

  @ApiPropertyOptional({ type: TourDetailsDto })
  @ValidateNested()
  @Type(() => TourDetailsDto)
  tour_details?: TourDetailsDto;

  @ApiPropertyOptional()
  @IsNumberString()
  @IsNotEmpty()
  @IsOptional()
  sale_price?: number;

  @ApiProperty({ enum: CurrencyType })
  @IsEnum(CurrencyType)
  currency: CurrencyType;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  duration?: string;

  @ApiProperty()
  @IsString()
  @IsISO8601()
  start_date: string;

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

  @ApiPropertyOptional({ type: [RouteDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RouteDto)
  route_json?: RouteDto[];

  @ApiPropertyOptional({ type: [IncludesDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IncludesDto)
  includes?: IncludesDto[];
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
