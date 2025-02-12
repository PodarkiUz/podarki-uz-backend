import { Injectable } from '@nestjs/common';
import { OrganizerRepo } from '../../shared/repo/organizer.repo';
import { FilesRepo } from 'src/travel/shared/repo/files.repo';
import { PaginationParams } from 'src/travel/shared/interfaces';

@Injectable()
export class OrganizerService {
  constructor(
    private readonly repo: OrganizerRepo,
    private readonly filesRepo: FilesRepo,
  ) {}

  async getAllList(params: PaginationParams) {
    const data = await this.repo.getAllOrganizers(params);
    return { data, total: Number(data[0]?.total || 0) };
  }

  async getOne(id: string) {
    const data = await this.repo.getById(id);
    return data;
  }
}
