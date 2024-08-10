import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductListByCategoryDto, SearchDto } from './dto/product.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/decorator/current-user.decorator';
import { IUser } from '../user/interface/user.interface';
import { ListPageDto } from 'src/shared/dto/list.dto';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('authorization')
  @Get('my')
  getUserProducts(@Query() params: ListPageDto, @CurrentUser() user: IUser) {
    return this.productService.getUserProducts(params, user);
  }

  @Get('list-by-category')
  listByCategory(
    @Query() query: ProductListByCategoryDto,
    @CurrentUser() user: IUser,
  ) {
    return this.productService.listByCategory(query, user);
  }

  @Get('lasts')
  getLastProducts() {
    return this.productService.getLastProducts();
  }

  @Get('search')
  searchProductByName(@Query() params: SearchDto) {
    return this.productService.searchProductByName(params);
  }

  @Get('get-ads')
  getLastAds() {
    return this.productService.getlastAds();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @CurrentUser() user: IUser) {
    return this.productService.delete(id, user);
  }
}
