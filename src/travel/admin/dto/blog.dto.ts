import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, Max, IsEnum, ValidateNested, IsArray } from 'class-validator';
import { FileDto } from 'src/travel/shared/dtos';
import { StatusEnum } from 'src/travel/shared/enums';

export class CreateBlogDto {
  @ApiProperty({ description: 'Blog title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Blog description/content' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'Blog author' })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiPropertyOptional({ description: 'Blog status (0: draft, 1: published)', default: StatusEnum.ACTIVE, enum: StatusEnum, enumName: 'StatusEnum' })
  @IsOptional()
  @IsEnum(StatusEnum)
  status?: StatusEnum;

  @ApiPropertyOptional({ type: [FileDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileDto)
  files?: FileDto[];
}

export class UpdateBlogDto extends PartialType(CreateBlogDto) {
  @ApiProperty({ description: 'Blog ID' })
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class BlogStatusDto {
  @ApiProperty({ description: 'Blog ID' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Blog status (0: draft, 1: published)' })
  @IsNumber()
  @Min(0)
  @Max(1)
  status: number;
}