import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class CreateBlogDto {
  @ApiProperty({ description: 'Blog title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Blog description/content' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Blog author' })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiPropertyOptional({ description: 'Blog status (0: draft, 1: published)', default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  status?: number;
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