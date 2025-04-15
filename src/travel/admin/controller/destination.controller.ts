import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DestinationService } from '../service/destination.service';
import {
  CreateDestinationDto,
  UpdateDestinationDto,
} from '../dto/destination.dto';
import { OneByIdDto, PaginationDto } from 'src/travel/shared/dtos';
import { AuthorizationJwtGuard } from 'src/travel/core/auth/guards/authorization.jwt.guard';

@ApiTags('ADMIN -> DESTINATION')
@ApiBearerAuth('authorization')
@UseGuards(AuthorizationJwtGuard)
@Controller('admin/destination')
export class DestinationController {
  constructor(private readonly service: DestinationService) { }

  @Post('create')
  create(@Body() body: CreateDestinationDto) {
    return this.service.create(body);
  }

  @Post('delete')
  delete(@Body() body: OneByIdDto) {
    return this.service.delete(body.id);
  }

  @Post('update')
  update(@Body() body: UpdateDestinationDto) {
    return this.service.update(body.id, body);
  }

  @Post('list')
  getAll(@Body() body: PaginationDto) {
    return this.service.getAllList(body);
  }

  @Post('get-by-id')
  getOne(@Body() params: OneByIdDto) {
    return this.service.getOne(params.id);
  }
}
