import { ApiProperty } from '@nestjs/swagger';
import { ICreateCategoryParam } from '../interface/category.interface';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto implements ICreateCategoryParam {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name_ru: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name_uz: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  avif_image: string;
}

export class DeleteCategoryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
