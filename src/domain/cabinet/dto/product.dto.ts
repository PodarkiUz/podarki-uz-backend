import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ListPageDto } from 'src/shared/dto/list.dto';

export class CabinetProductListDto extends ListPageDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  sub_category_id?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  on_sale?: boolean;
}
