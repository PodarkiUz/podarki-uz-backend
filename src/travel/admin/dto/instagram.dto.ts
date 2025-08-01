import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class FetchInstagramPostsDto {
  @IsString()
  username: string;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsBoolean()
  recentOnly?: boolean;

  @IsOptional()
  @IsNumber()
  daysBack?: number;
}

export class FetchInstagramPostByUrlDto {
  @ApiProperty({
    description: 'The URL of the Instagram post',
    example: 'https://www.instagram.com/p/C-1234567890/',
  })
  @IsString()
  postUrl: string;
}

export class ProcessInstagramPostDto {
  @ApiProperty({
    description: 'The URL of the Instagram post',
    example: 'https://www.instagram.com/p/C-1234567890/',
  })
  @IsOptional()
  @IsString()
  postUrl?: string;
}

export class ProcessInstagramPostResponseDto {
  @ApiProperty({
    description: 'The ID of the Instagram post',
    example: '1234567890',
  })
  @IsString()
  id: string;

  @IsNumber()
  mainImageIndex: number;
}

export class InstagramChannelConfigDto {
  @IsString()
  username: string;

  @IsString()
  organizerId: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
