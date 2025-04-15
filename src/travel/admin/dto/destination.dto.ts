import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
  IsArray,
  IsNumber,
} from 'class-validator';
import { FileDto, LanguageDto } from 'src/travel/shared/dtos';

export class CreateDestinationDto {
  @ApiProperty({ type: LanguageDto })
  @ValidateNested()
  @Type(() => LanguageDto)
  title: LanguageDto;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  location: number;

  @ApiPropertyOptional({ type: [FileDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileDto)
  files?: FileDto[];
}

export class UpdateDestinationDto extends PartialType(CreateDestinationDto) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
