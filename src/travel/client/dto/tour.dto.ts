import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsISO8601, IsNumber, IsOptional, IsString } from 'class-validator';
import { TourDifficulty, TourType } from 'src/travel/admin/dto/tour.dto';
import { PaginationDto } from 'src/travel/shared/dtos';
import { TourOrderTypes } from '../interface/tour.interface';

export class GetTourListClientDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsISO8601()
  from_date?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsISO8601()
  to_date?: string;

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

  @ApiPropertyOptional({ enum: TourType, enumName: 'TourType' })
  @IsOptional()
  @IsEnum(TourType)
  tour_type?: TourType;

  @ApiPropertyOptional({ enum: TourDifficulty, enumName: 'TourDifficulty' })
  @IsOptional()
  @IsEnum(TourDifficulty)
  difficulty?: TourDifficulty;

  @ApiPropertyOptional({ enum: TourOrderTypes, enumName: 'TourOrderTypes' })
  @IsOptional()
  @IsEnum(TourOrderTypes)
  order_by?: TourOrderTypes;
}
