import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OneByIdDto, PaginationDto } from 'src/travel/shared/dtos';
import { AuthorizationJwtGuard } from 'src/travel/core/auth/guards/authorization.jwt.guard';
import { OrganizerService } from '../service/organizer.service';
import { Lang } from 'src/travel/shared/decorators';
import { ILanguage } from 'src/travel/shared/interfaces';

@ApiTags('ORGANIZER')
// @ApiBearerAuth('authorization')
// @UseGuards(AuthorizationJwtGuard)
@Controller('organizer')
export class OrganizerController {
  constructor(private readonly service: OrganizerService) {}

  @Post('list')
  getAll(@Body() body: PaginationDto, @Lang() lang: ILanguage) {
    return this.service.getAllList(body, lang);
  }

  @Post('get-by-id')
  getOne(@Body() params: OneByIdDto) {
    return this.service.getOne(params.id);
  }
}
