import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateIdeasGroupDto,
  DeleteIdeasGroupDto,
  UpdateIdeasGroupDto,
} from '../dto/ideas-group.dto';
import { IdeasGroupService } from '../service/ideas-group.service';

@ApiTags('ADMIN -> IDEAS-GROUP')
@Controller('admin/ideas-group')
export class IdeasGroupController {
  constructor(private readonly ideasGroupService: IdeasGroupService) {}

  @Post('create')
  create(@Body() body: CreateIdeasGroupDto) {
    return this.ideasGroupService.create(body);
  }

  @Post('delete')
  delete(@Body() body: DeleteIdeasGroupDto) {
    return this.ideasGroupService.delete(body.id);
  }

  @Post('update')
  update(@Body() body: UpdateIdeasGroupDto) {
    return this.ideasGroupService.update(body.id, body);
  }

  @Post('get-list')
  getAll() {
    return this.ideasGroupService.getAllList();
  }
}
