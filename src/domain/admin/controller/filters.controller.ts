import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FiltersService } from '../service/filters.service';
import {
  CreateFilterDto,
  DeleteFilterDto,
  UpdateFilterDto,
} from '../dto/filters.dto';

@ApiTags('ADMIN -> FILTERS')
@Controller('admin/filters')
export class FiltersController {
  constructor(private readonly filterService: FiltersService) {}

  @Post('create')
  create(@Body() body: CreateFilterDto) {
    return this.filterService.create(body);
  }

  // @Post('create-filter-value')
  // createFilterValue(@Body() body: CreateFilterValueDto) {
  //   return this.filterService.createFilterValue(body);
  // }

  @Post('delete')
  delete(@Body() body: DeleteFilterDto) {
    return this.filterService.delete(body.id);
  }

  @Post('update')
  update(@Body() body: UpdateFilterDto) {
    return this.filterService.update(body.id, body);
  }

  @Post('get-list')
  getAll() {
    return this.filterService.getAllList();
  }
}
