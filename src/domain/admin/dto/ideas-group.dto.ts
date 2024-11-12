import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ICreateIdeasGroupParam } from '../interface/ideas-group.interface';

export class CreateIdeasGroupDto implements ICreateIdeasGroupParam {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name_ru: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name_uz: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  reason_id?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  is_main?: boolean;
}

export class DeleteIdeasGroupDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class UpdateIdeasGroupDto {
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
  @IsString()
  @IsOptional()
  reason_id?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  is_main?: boolean;
}
