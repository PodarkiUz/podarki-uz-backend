import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrganizerService } from '../service/organizer.service';
import { CreateOrganizerDto, UpdateOrganizerDto } from '../dto/organizer.dto';
import { OneByIdDto, PaginationDto } from 'src/travel/shared/dtos';

@ApiTags('ORGANIZER')
// @ApiBearerAuth('authorization')
// @UseGuards(AuthorizationJwtGuard)
@Controller('organizer')
export class OrganizerController {
  constructor(private readonly service: OrganizerService) {}

  @Post('create')
  create(@Body() body: CreateOrganizerDto) {
    return this.service.create(body);
  }

  @Post('delete')
  delete(@Body() body: OneByIdDto) {
    return this.service.delete(body.id);
  }

  @Post('update')
  update(@Body() body: UpdateOrganizerDto) {
    return this.service.update(body.id, body);
  }

  @Post('list')
  getAll(@Body() body: PaginationDto) {
    return this.service.getAllList(body);
  }
}
