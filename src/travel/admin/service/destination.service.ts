import { Injectable } from '@nestjs/common';
import { DestinationRepo } from 'src/travel/shared/repo/destination.repo';
import { FilesRepo } from 'src/travel/shared/repo/files.repo';
import { FileDependentType } from 'src/travel/shared/enums';
import {
  CreateDestinationDto,
  UpdateDestinationDto,
} from '../dto/destination.dto';
import { PaginationParams } from 'src/travel/shared/interfaces';
import { isEmpty } from 'lodash';

@Injectable()
export class DestinationService {
  constructor(
    private readonly repo: DestinationRepo,
    private readonly filesRepo: FilesRepo,
  ) { }

  async create(params: CreateDestinationDto) {
    return this.repo.knex.transaction(async (trc) => {
      const destination = await this.repo.insert({
        title: params.title,
        location: params.location,
        status: 1,
        is_deleted: false,
      });

      if (!isEmpty(params?.files)) {
        await this.filesRepo.bulkInsertWithTransaction(
          trc,
          params.files.map((file) => ({
            depend: FileDependentType.tour,
            dependent_id: destination.id,
            name: file.name,
            size: file.size,
            type: file.type,
            url: file.url,
          })),
        );
      }

      return { success: true, data: destination };
    });
  }

  async update(id: string, params: UpdateDestinationDto) {
    return this.repo.knex.transaction(async (trc) => {
      const data: Record<string, any> = {
        ...(params?.title && { title: params.title }),
        ...(params?.location && { location: params.location }),
      };

      if (!isEmpty(data)) {
        await this.repo.updateByIdWithTransaction(trc, id, data);
      }

      if (!isEmpty(params?.files)) {
        await this.filesRepo.deleteWithTransaction(trc, { dependent_id: id });
        await this.filesRepo.bulkInsertWithTransaction(
          trc,
          params.files.map((file) => ({
            depend: FileDependentType.tour,
            dependent_id: id,
            name: file.name,
            size: file.size,
            type: file.type,
            url: file.url,
          })),
        );
      }

      return { success: true };
    });
  }

  async delete(id: string) {
    return this.repo.knex.transaction(async (trc) => {
      await this.repo.updateByIdWithTransaction(trc, id, { is_deleted: true });
      await this.filesRepo.deleteWithTransaction(trc, { dependent_id: id });
      return { success: true };
    });
  }

  async getAllList(params: PaginationParams) {
    const data = await this.repo.getAllList(params);
    return { data, total: Number(data[0]?.total) || 0 };
  }

  async getOne(id: string) {
    return this.repo.getById(id);
  }
}
