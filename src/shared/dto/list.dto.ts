import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ListPageDto {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  page_size?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search?: string;
}

export class FindByIdDto {
  @ApiProperty()
  @IsString()
  id: string;
}
