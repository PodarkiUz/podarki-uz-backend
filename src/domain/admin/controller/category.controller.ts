import { Body, Controller, Post } from '@nestjs/common';
import { CreateCategoryDto, DeleteCategoryDto, UpdateCategoryDto } from '../dto/category.dto';
import { CategoryService } from '../service/category.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ADMIN -> CATEGORY')
@Controller('admin/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
  create(@Body() body: CreateCategoryDto) {
    return this.categoryService.create(body);
  }

  @Post('delete')
  delete(@Body() body: DeleteCategoryDto) {
    return this.categoryService.delete(body.id);
  }

  @Post('update')
  update(@Body() body: UpdateCategoryDto) {
    return this.categoryService.update(body.id, body);
  }

  @Post('get-list')
  getAll() {
    return this.categoryService.getAllList();
  }
}
