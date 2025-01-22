import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsISO8601,
  IsEnum,
  Min,
  IsNumberString,
} from 'class-validator';
import {
  ITourCreateParam,
  ITourSeachByName,
} from '../interface/tour.interface';
import { OrganizerStatus } from '../admin.enum';

export class CreateTourDto implements ITourCreateParam {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name_uz: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name_ru: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description_uz?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description_ru?: string;

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
  @IsNotEmpty()
  organizer_id: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  seats: number;
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
}
