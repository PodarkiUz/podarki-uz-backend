import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsISO8601, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/travel/shared/dtos';

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
}
