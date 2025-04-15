import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DestinationService } from '../service/destination.service';
import { GetDestinationListClientDto } from '../dto/destination.dto';
import { OneByIdDto } from 'src/travel/shared/dtos';
import { Lang } from 'src/travel/shared/decorators';
import { ILanguage } from 'src/travel/shared/interfaces';

@ApiTags('DESTINATION')
@Controller('destination')
export class DestinationController {
  constructor(private readonly service: DestinationService) { }

  @Post('list')
  getAll(@Body() body: GetDestinationListClientDto, @Lang() lang: ILanguage) {
    return this.service.getAllList(body, lang);
  }

  @Post('get-by-id')
  getOne(@Body() params: OneByIdDto) {
    return this.service.getOne(params.id);
  }
}
