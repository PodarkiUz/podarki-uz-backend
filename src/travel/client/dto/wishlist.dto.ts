import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsUrl,
} from 'class-validator';
import { PaginationDto } from 'src/travel/shared/dtos';

export class CreateWishlistDto {
  @ApiProperty({ description: 'Title of the wishlist item' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({ description: 'Image URL for the wishlist item' })
  @IsString()
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiPropertyOptional({ description: 'Product URL for the wishlist item' })
  @IsString()
  @IsOptional()
  @IsUrl()
  productUrl?: string;
}

export class UpdateWishlistDto extends PartialType(CreateWishlistDto) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class GetWishlistListDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Search wishlist items by title' })
  @IsString()
  @IsOptional()
  search?: string;
}
