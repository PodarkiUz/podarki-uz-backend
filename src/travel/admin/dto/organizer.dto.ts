import { FilesDto, ShopBannerFilesDto } from '@domain/admin/dto/product.dto';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { IOrganizerCreateParam } from '../interface/admin.interface';

export class CreateOrganizerDto implements IOrganizerCreateParam {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description_uz?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description_ru?: string;

  @ApiPropertyOptional({ type: FilesDto })
  @ValidateNested()
  @IsOptional()
  @Type(() => FilesDto)
  image?: FilesDto;

  @ApiPropertyOptional({ type: ShopBannerFilesDto })
  @ValidateNested()
  @Type(() => ShopBannerFilesDto)
  @IsOptional()
  banner_image?: ShopBannerFilesDto;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone: string;
}

export class UpdateOrganizerDto extends PartialType(CreateOrganizerDto) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
