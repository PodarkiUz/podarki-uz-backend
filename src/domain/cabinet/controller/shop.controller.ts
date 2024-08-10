import { UseGuards, Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ShopLoginDto } from '../dto/shop.dto';
import { CabinetShopService } from '../service/shop.service';
import { UpdateShopByCabinetDto } from 'src/domain/admin/dto/shop.dto';
import { CabinetGuard } from 'src/guard/cabinet.guard';
import { CurrentShop } from 'src/decorator/current-shop.decorator';
import {
  CreateProductByShopDto,
  UpdateProductByShopDto,
} from 'src/domain/client/product/dto/product.dto';
import { ListPageDto } from 'src/shared/dto/list.dto';
import { CabinetProductListDto } from '../dto/product.dto';

@ApiTags('Cabinet')
// @ApiBearerAuth('authorization')
// @UseGuards(AdminGuard)
@Controller('cabinet/shop')
export class CabinetShopController {
  constructor(private readonly cabinetShopService: CabinetShopService) { }

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

  @ApiBearerAuth('authorization')
  @UseGuards(CabinetGuard)
  @Post('product/create')
  async createProduct(
    @Body() params: CreateProductByShopDto,
    @CurrentShop() currentShop,
  ) {
    return this.cabinetShopService.createProduct(params, currentShop);
  }

  @ApiBearerAuth('authorization')
  @UseGuards(CabinetGuard)
  @Post('product/update')
  async updateProduct(
    @Body() params: UpdateProductByShopDto,
    @CurrentShop() currentShop,
  ) {
    return this.cabinetShopService.updateProduct(params, currentShop);
  }

  @ApiBearerAuth('authorization')
  @UseGuards(CabinetGuard)
  @Post('product/list')
  async shopProductList(
    @Body() params: CabinetProductListDto,
    @CurrentShop() currentShop,
  ) {
    return this.cabinetShopService.productList(params, currentShop);
  }
}
