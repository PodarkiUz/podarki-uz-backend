import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IdeasService } from '../service/ideas.service';
import {
  CreateIdeasDto,
  CreateIdeasFilterDto,
  DeleteIdeasDto,
  UpdateIdeasDto,
} from '../dto/ideas.dto';

@ApiTags('ADMIN -> IDEAS')
@Controller('admin/ideas')
export class IdeasController {
  constructor(private readonly ideasService: IdeasService) {}

  @Post('create')
  create(@Body() body: CreateIdeasDto) {
    return this.ideasService.create(body);
  }

  @Post('delete')
  delete(@Body() body: DeleteIdeasDto) {
    return this.ideasService.delete(body.id);
  }

  @Post('update')
  update(@Body() body: UpdateIdeasDto) {
    return this.ideasService.update(body.id, body);
  }

  @Post('get-list')
  getAll() {
    return this.ideasService.getAllList();
  }

  @Post('add-filter')
  addProductFilter(@Body() body: CreateIdeasFilterDto) {
    return this.ideasService.addIdeasFilter(body);
  }
}
