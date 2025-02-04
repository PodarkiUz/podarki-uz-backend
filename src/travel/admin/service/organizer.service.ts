import { Injectable } from '@nestjs/common';
import { OrganizerRepo } from '../../shared/repo/organizer.repo';
import {
  IOrganizerCreateParam,
  IOrganizerUpdateParam,
} from '../interface/admin.interface';
import { OrganizerStatus } from '../admin.enum';
import { isEmpty } from 'lodash';
import { FilesRepo } from 'src/travel/shared/repo/files.repo';

@Injectable()
export class OrganizerService {
  constructor(
    private readonly repo: OrganizerRepo,
    private readonly filesRepo: FilesRepo,
  ) {}

  async create(params: IOrganizerCreateParam) {
    return this.repo.knex.transaction(async (trc) => {
      const organizer = await this.repo.insertWithTransaction(trc, {
        status: OrganizerStatus.Registered,
        description: params?.description,
        title: params.title,
        phone: params.phone,
      });

      if (!isEmpty(params?.files)) {
        await this.filesRepo.bulkInsertWithTransaction(
          trc,
          params.files.map((file) => ({
            depend: 'organizer',
            dependent_id: organizer.id,
            name: file.name,
            size: file.size,
            type: file.type,
            url: file.url,
          })),
        );
      }

      return { success: true, data: organizer };
    });
  }

  async delete(id: string) {
    await this.repo.updateById(id, { is_deleted: true });
    return { success: true };
  }

  async update(id: string, params: IOrganizerUpdateParam) {
    return this.repo.updateById(id, params);
  }

  async getAllList() {
    const data = await this.repo.getAllOrganizers();
    return { data, total: Number(data[0]?.total || 0) };
  }
}
