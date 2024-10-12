import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoryGroupService } from '../service/category-group.service';
import {
  CreateCategoryGroupDto,
  DeleteCategoryGroupDto,
  UpdateCategoryGroupDto,
} from '../dto/category-group.dto';

@ApiTags('ADMIN -> CATEGORY-GROUP')
@Controller('admin/category-group')
export class CategoryGroupController {
  constructor(private readonly categoryGroupService: CategoryGroupService) {}

  @Post('create')
  create(@Body() body: CreateCategoryGroupDto) {
    return this.categoryGroupService.create(body);
  }

  @Post('delete')
  delete(@Body() body: DeleteCategoryGroupDto) {
    return this.categoryGroupService.delete(body.id);
  }

  @Post('update')
  update(@Body() body: UpdateCategoryGroupDto) {
    return this.categoryGroupService.update(body.id, body);
  }

  @Post('get-list')
  getAll() {
    return this.categoryGroupService.getAllList();
  }
}
