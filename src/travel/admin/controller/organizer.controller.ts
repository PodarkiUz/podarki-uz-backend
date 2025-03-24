import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrganizerService } from '../service/organizer.service';
import { CreateOrganizerDto, UpdateOrganizerDto } from '../dto/organizer.dto';
import { OneByIdDto, PaginationDto } from 'src/travel/shared/dtos';
import { AuthorizationJwtGuard } from 'src/travel/core/auth/guards/authorization.jwt.guard';
import { CurrentUser } from '@shared/decorator/current-user.decorator';
import { ICurrentOrganizer } from '@shared/interfaces/current-user';

@ApiTags('ADMIN -> ORGANIZER')
@ApiBearerAuth('authorization')
@UseGuards(AuthorizationJwtGuard)
@Controller('admin/organizer')
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

  @Post('get-by-id')
  getOne(@Body() params: OneByIdDto) {
    return this.service.getOne(params.id);
  }

  @Post('me')
  me(@CurrentUser() organizer: ICurrentOrganizer) {
    return this.service.me(organizer.id);
  }
}
