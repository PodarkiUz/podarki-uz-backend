import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiTags } from '@nestjs/swagger';
import { ListPageDto } from 'src/shared/dto/list.dto';
import { SubcategoryListPageDto } from 'src/domain/admin/dto/category-admin.dto';

@ApiTags('Client/category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('list')
  getAll(@Body() params: ListPageDto) {
    return this.categoryService.getCategoryList(params);
  }

  @Post('sub-category/list')
  getSubcategoryList(@Body() params: SubcategoryListPageDto) {
    return this.categoryService.getSubcategoryList(params);
  }
}
