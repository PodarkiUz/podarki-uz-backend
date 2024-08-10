import { UseGuards, Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ShopLoginDto } from '../dto/shop.dto';
import { CabinetShopService } from '../service/shop.service';
import {
  UpdateShopByCabinetDto,
  UpdateShopDto,
} from 'src/domain/admin/dto/shop.dto';
import { AdminGuard } from 'src/guard/admin.guard';
import { CabinetGuard } from 'src/guard/cabinet.guard';
import { CurrentShop } from 'src/decorator/current-shop.decorator';

@ApiTags('Cabinet')
// @ApiBearerAuth('authorization')
// @UseGuards(AdminGuard)
@Controller('cabinet/shop')
export class CabinetShopController {
  constructor(private readonly cabinetShopService: CabinetShopService) {}

  @Post('login')
  async create(@Body() params: ShopLoginDto) {
    return this.cabinetShopService.login(params);
  }

  @ApiBearerAuth('authorization')
  @UseGuards(CabinetGuard)
  @Post('update')
  async update(
    @Body() params: UpdateShopByCabinetDto,
    @CurrentShop() currentShop,
  ) {
    return this.cabinetShopService.update(params, currentShop);
  }
}
