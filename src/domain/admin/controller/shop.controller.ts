import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/guard/admin.guard';
import { AdminShopService } from '../service/shop.service';
import { CreateShopDto, UpdateShopDto } from '../dto/shop.dto';
import { ListPageDto } from 'src/shared/dto/list.dto';

@ApiTags('Admin')
// @ApiBearerAuth('authorization')
// @UseGuards(AdminGuard)
@Controller('admin/shop')
export class AdminShopController {
  constructor(private readonly adminShopService: AdminShopService) {}

  @Post('create')
  async create(@Body() params: CreateShopDto) {
    return this.adminShopService.create(params);
  }

  @Post('update')
  async update(@Body() params: UpdateShopDto) {
    return this.adminShopService.update(params);
  }

  @Post('all')
  getAllSubcategories(@Body() params: ListPageDto) {
    return this.adminShopService.getAllShops(params);
  }
}
