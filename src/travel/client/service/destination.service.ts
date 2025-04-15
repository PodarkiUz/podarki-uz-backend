import { Injectable } from '@nestjs/common';
import { DestinationRepo } from 'src/travel/shared/repo/destination.repo';
import { ILanguage, PaginationParams } from 'src/travel/shared/interfaces';
import { GetDestinationListClientDto } from '../dto/destination.dto';

@Injectable()
export class DestinationService {
  constructor(private readonly repo: DestinationRepo) { }

  async getAllList(params: GetDestinationListClientDto, lang: ILanguage) {
    const data = await this.repo.getAllList(params, lang);
    return { data, total: Number(data[0]?.total) || 0 };
  }

  async getOne(id: string) {
    return this.repo.getById(id);
  }
}
