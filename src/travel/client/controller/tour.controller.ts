import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OneByIdDto, PaginationDto } from 'src/travel/shared/dtos';
// import { AuthorizationJwtGuard } from 'src/travel/core/auth/guards/authorization.jwt.guard';
import { SearchTourByNameDto } from 'src/travel/admin/dto/tour.dto';
import { TourService } from '../service/tour.service';
import { Lang } from 'src/travel/shared/decorators';
import { ILanguage } from 'src/travel/shared/interfaces';

@ApiTags('TOUR')
// @ApiBearerAuth('authorization')
// @UseGuards(AuthorizationJwtGuard)
@Controller('tour')
export class TourController {
  constructor(private readonly service: TourService) {}

  @Post('list')
  getAll(@Body() body: PaginationDto, @Lang() lang: ILanguage) {
    return this.service.getAllList(body, lang);
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
