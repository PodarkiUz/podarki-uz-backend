import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
} from '@nestjs/common';
import { AdminCategoryService } from '../service/category.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/guard/admin.guard';
import {
  CreateCategoryDto,
  CreateSubcategoryDto,
  SubcategoryListPageDto,
  UpdateCategoryDto,
} from 'src/domain/admin/dto/category-admin.dto';
import { ListPageDto } from 'src/shared/dto/list.dto';

@ApiTags('Admin')
// @UseGuards(AdminGuard)
// @ApiBearerAuth('authorization')
@Controller('admin')
export class AdminCategoryController {
  constructor(private readonly adminCategoryService: AdminCategoryService) {}

  @Post('category/create')
  create(@Body() params: CreateCategoryDto) {
    return this.adminCategoryService.create(params);
  }

  @Post('category/all')
  getAllCategories(@Body() params: ListPageDto) {
    return this.adminCategoryService.getAllCategories(params);
  }

  @Post('category/update')
  async update(@Body() params: UpdateCategoryDto) {
    return this.adminCategoryService.update(params);
  }

  @Post('category/delete')
  async delete(@Param('id') id: string) {
    return this.adminCategoryService.delete(id);
  }

  @Post('sub-category/create')
  createSubCategory(@Body() params: CreateSubcategoryDto) {
    return this.adminCategoryService.createSubcategory(params);
  }

  @Post('sub-category/all')
  getAllSubcategories(@Body() params: SubcategoryListPageDto) {
    return this.adminCategoryService.getAllSubCategories(params);
  }

  @Post('sub-category/update')
  async updateSubcategory(@Body() params: UpdateCategoryDto) {
    return this.adminCategoryService.updateSubcategory(params);
  }

  @Post('sub-category/delete')
  async deleteSubcategory(@Param('id') id: string) {
    return this.adminCategoryService.deleteSubcategory(id);
  }
}
