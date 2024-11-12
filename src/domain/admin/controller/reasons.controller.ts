import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReasonsService } from '../service/reasons.service';
import {
  CreateReasonDto,
  DeleteReasonDto,
  UpdateReasonDto,
} from '../dto/reason.dto';

@ApiTags('ADMIN -> REASONS')
@Controller('admin/reasons')
export class ReasonsController {
  constructor(private readonly reasonService: ReasonsService) {}

  @Post('create')
  create(@Body() body: CreateReasonDto) {
    return this.reasonService.create(body);
  }

  @Post('delete')
  delete(@Body() body: DeleteReasonDto) {
    return this.reasonService.delete(body.id);
  }

  @Post('update')
  update(@Body() body: UpdateReasonDto) {
    return this.reasonService.update(body.id, body);
  }

  @Post('get-list')
  getAll() {
    return this.reasonService.getAllList();
  }
}
