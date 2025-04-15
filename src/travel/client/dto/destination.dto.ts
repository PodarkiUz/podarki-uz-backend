import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/travel/shared/dtos';

export class GetDestinationListClientDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  location?: number;
} 