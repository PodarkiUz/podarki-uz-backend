import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { AdminProductService } from '../service/product.service';
import { SetProductStatusDto } from '../dto/product-admin.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/guard/admin.guard';
import { ProductService } from 'src/domain/client/product/product.service';
import { OrderListDto } from 'src/domain/orders/dto/order.dto';
import { ListPageDto } from 'src/shared/dto/list.dto';
import {
  CreateProductByAdminDto,
  UpdateProductByAdminDto,
} from 'src/domain/client/product/dto/product.dto';

@ApiTags('Admin')
// @ApiBearerAuth('authorization')
// @UseGuards(AdminGuard)
@Controller('admin/product')
export class AdminProductController {
  constructor(
    private readonly adminProductService: AdminProductService,
    private readonly productService: ProductService,
  ) { }

  @Post('create')
  async create(@Body() params: CreateProductByAdminDto) {
    return this.adminProductService.create(params);
  }

  @Post('update')
  async update(@Body() params: UpdateProductByAdminDto) {
    return this.adminProductService.update(params);
  }

  @Post('set-status')
  async setStatus(@Body() params: SetProductStatusDto) {
    return this.adminProductService.setStatus(params);
  }

  // @Post('list')
  // async list(@Body() params: ListPageDto) {
  //   return this.adminProductService.findAll(params);
  // }

  // @Post('order-list')
  // async orderList(@Body() params: OrderListDto) {
  //   return this.adminProductService.orderList(params);
  // }

  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //   return this.productService.findOne(id);
  // }

  // @Delete(':id')
  // async delete(@Param('id') id: string) {
  //   return this.adminProductService.delete(id);
  // }
}
