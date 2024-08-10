import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ListPageDto } from 'src/shared/dto/list.dto';

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  @MaxLength(64)
  name_uz: string;

  @ApiProperty()
  @IsString()
  @MaxLength(64)
  name_ru: string;

  @ApiProperty()
  @IsString()
  @MaxLength(64)
  name_en: string;

  @ApiProperty()
  @IsString()
  avif_image: string;

  // @ApiProperty()
  // @IsString()
  // original_image: string;

  @ApiProperty()
  @IsString()
  small_image: string;
}

export class CreateSubcategoryDto {
  @ApiProperty()
  @IsString()
  @MaxLength(64)
  name_uz: string;

  @ApiProperty()
  @IsString()
  @MaxLength(64)
  name_ru: string;

  @ApiProperty()
  @IsString()
  @MaxLength(64)
  name_en: string;

  @ApiProperty()
  @IsString()
  avif_image: string;

  // @ApiProperty()
  // @IsString()
  // original_image: string;

  @ApiProperty()
  @IsString()
  small_image: string;

  @ApiProperty()
  @IsString()
  category_id: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiProperty()
  @IsString()
  id: string;
}
export class UpdateSubcategoryDto extends PartialType(CreateSubcategoryDto) {
  @ApiProperty()
  @IsString()
  id: string;
}

export class SubcategoryListPageDto extends ListPageDto {
  @ApiProperty()
  @IsString()
  category_id: string;
}
