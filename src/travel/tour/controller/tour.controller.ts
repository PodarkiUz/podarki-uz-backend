import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TourService } from '../service/tour.service';
import { CreateTourDto, SearchTourByNameDto, UpdateTourDto } from '../dto/tour.dto';

@ApiTags('TOUR')
// @ApiBearerAuth('authorization')
// @UseGuards(AuthorizationJwtGuard)
@Controller('tour')
export class TourController {
  constructor(private readonly service: TourService) { }

  @Post('create')
  create(@Body() body: CreateTourDto) {
    return this.service.create(body);
  }

  @Post('delete')
  delete(@Body() body: UpdateTourDto) {
    return this.service.delete(body.id);
  }

  @Post('update')
  update(@Body() body: UpdateTourDto) {
    return this.service.update(body.id, body);
  }

  @Post('get-list')
  getAll() {
    return this.service.getAllList();
  }

  @Post('search')
  searchByTourName(@Body() params: SearchTourByNameDto) {
    return this.service.searchTourByName(params);
  }
}
