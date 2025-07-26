import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TourService } from '../service/tour.service';
import {
  CreateTourDto,
  SearchTourByNameDto,
  UpdateTourDto,
} from '../dto/tour.dto';
import { OneByIdDto, PaginationDto } from 'src/travel/shared/dtos';
import { AuthorizationJwtGuard } from 'src/travel/core/auth/guards/authorization.jwt.guard';
import { CurrentUser } from '@shared/decorator/current-user.decorator';
import { ICurrentOrganizer } from '@shared/interfaces/current-user';
import { ILanguage } from 'src/travel/shared/interfaces';
import { Lang } from 'src/travel/shared/decorators';

@ApiTags('ADMIN -> TOUR')

@Controller('admin/tour')
export class TourController {
  constructor(private readonly service: TourService) {}

  @ApiBearerAuth('authorization')
  @UseGuards(AuthorizationJwtGuard)
  @Post('create')
  create(
    @Body() body: CreateTourDto,
    @CurrentUser() organizer: ICurrentOrganizer,
  ) {
    return this.service.create(body, organizer);
  }

  @Post('createWithoutAuth')
  createWithoutAuth(@Body() body: CreateTourDto) {
    return this.service.create(body);
  }

  @ApiBearerAuth('authorization')
  @UseGuards(AuthorizationJwtGuard)
  @Post('delete')
  delete(@Body() body: OneByIdDto) {
    return this.service.delete(body.id);
  }

  @ApiBearerAuth('authorization')
  @UseGuards(AuthorizationJwtGuard)
  @Post('update')
  update(@Body() body: UpdateTourDto) {
    return this.service.update(body.id, body);
  }

  @ApiBearerAuth('authorization')
  @UseGuards(AuthorizationJwtGuard)
  @Post('list')
  getAll(@Body() body: PaginationDto, @Lang() lang: ILanguage) {
    return this.service.getAllList(body, lang);
  }

  @ApiBearerAuth('authorization')
  @UseGuards(AuthorizationJwtGuard)
  @Post('cities-list')
  citiesList(@Body() body: PaginationDto) {
    return this.service.getCitiesList(body);
  }

  @ApiBearerAuth('authorization')
  @UseGuards(AuthorizationJwtGuard)
  @Post('search')
  searchByTour(@Body() params: SearchTourByNameDto) {
    return this.service.searchTour(params);
  }

  @ApiBearerAuth('authorization')
  @UseGuards(AuthorizationJwtGuard)
  @Post('get-by-id')
  getOne(@Body() params: OneByIdDto) {
    return this.service.getOne(params.id);
  }
}
