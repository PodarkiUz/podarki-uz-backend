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

@ApiTags('ADMIN -> TOUR')
@ApiBearerAuth('authorization')
@UseGuards(AuthorizationJwtGuard)
@Controller('admin/tour')
export class TourController {
  constructor(private readonly service: TourService) {}

  @Post('create')
  create(
    @Body() body: CreateTourDto,
    @CurrentUser() organizer: ICurrentOrganizer,
  ) {
    return this.service.create(body, organizer);
  }

  @Post('delete')
  delete(@Body() body: OneByIdDto) {
    return this.service.delete(body.id);
  }

  @Post('update')
  update(@Body() body: UpdateTourDto) {
    return this.service.update(body.id, body);
  }

  @Post('list')
  getAll(@Body() body: PaginationDto) {
    return this.service.getAllList(body);
  }

  @Post('cities-list')
  citiesList(@Body() body: PaginationDto) {
    return this.service.getCitiesList(body);
  }

  @Post('search')
  searchByTour(@Body() params: SearchTourByNameDto) {
    return this.service.searchTour(params);
  }

  @Post('get-by-id')
  getOne(@Body() params: OneByIdDto) {
    return this.service.getOne(params.id);
  }
}
