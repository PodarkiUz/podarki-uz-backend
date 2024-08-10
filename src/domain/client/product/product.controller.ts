import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductListByCategoryDto } from './dto/product.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/decorator/current-user.decorator';
import { IUser } from '../user/interface/user.interface';
import { FindByIdDto, ListPageDto } from 'src/shared/dto/list.dto';

@ApiTags('Client/product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // @UseGuards(AuthGuard)
  // @ApiBearerAuth('authorization')
  // @Get('my')
  // getUserProducts(@Query() params: ListPageDto, @CurrentUser() user: IUser) {
  //   return this.productService.getUserProducts(params, user);
  // }

  @Post('list-by-category')
  listByCategory(
    @Body() query: ProductListByCategoryDto,
    @CurrentUser() user: IUser,
  ) {
    return this.productService.listByCategory(query, user);
  }

  // @Get('lasts')
  // getLastProducts() {
  //   return this.productService.getLastProducts();
  // }

  @Post('search')
  searchProductByName(@Body() params: ListPageDto) {
    return this.productService.searchProductByName(params);
  }

  // @Get('get-ads')
  // getLastAds() {
  //   return this.productService.getlastAds();
  // }

  @Post('find-by-id')
  findOne(@Body() params: FindByIdDto) {
    return this.productService.findOne(params);
  }

  // @Delete(':id')
  // async delete(@Param('id') id: string, @CurrentUser() user: IUser) {
  //   return this.productService.delete(id, user);
  // }
}
