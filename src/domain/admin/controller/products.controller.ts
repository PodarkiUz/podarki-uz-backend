import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductsService } from '../service/products.service';
import {
  CreateProductDto,
  CreateProductFilterDto,
  DeleteProductDto,
  GetProductsByCategoryDto,
  GetProductsByIdeaDto,
  UpdateProductDto,
} from '../dto/product.dto';

@ApiTags('ADMIN -> PRODUCTS')
@Controller('admin/products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Post('create')
  create(@Body() body: CreateProductDto) {
    return this.productService.create(body);
  }

  @Post('delete')
  delete(@Body() body: DeleteProductDto) {
    return this.productService.delete(body.id);
  }

  @Post('update')
  update(@Body() body: UpdateProductDto) {
    return this.productService.update(body.id, body);
  }

  @Post('get-list')
  getAll() {
    return this.productService.getAllList();
  }

  @Post('get-by-idea')
  getProductsByIdea(@Body() body: GetProductsByIdeaDto) {
    return this.productService.getProductsByIdea(body.idea_id);
  }

  @Post('get-by-category')
  getProductsByCategory(@Body() body: GetProductsByCategoryDto) {
    return this.productService.getProductsByCategory(body.category_id);
  }

  @Post('add-filter')
  addProductFilter(@Body() body: CreateProductFilterDto) {
    return this.productService.addProductFilter(body);
  }
}
