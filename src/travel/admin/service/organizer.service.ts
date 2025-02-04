import { Injectable } from '@nestjs/common';
import { OrganizerRepo } from '../../shared/repo/organizer.repo';
import {
  IOrganizerCreateParam,
  IOrganizerUpdateParam,
} from '../interface/admin.interface';
import { OrganizerStatus } from '../admin.enum';
import { isEmpty } from 'lodash';
import { FilesRepo } from 'src/travel/shared/repo/files.repo';
import { compareStringArrays } from 'src/travel/shared/utils';
import { FileDependentType } from 'src/travel/shared/enums';

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
    return this.repo.knex.transaction(async (trc) => {
      const data: Record<string, any> = {
        ...(params?.title && { birth_date: params.title }),
        ...(params?.description && { first_name: params.description }),
        ...(params?.phone && { last_name: params.phone }),
      };

      if (!isEmpty(data)) {
        await this.repo.updateByIdWithTransaction(trc, id, data);
      }

      // Files update logic
      if (!isEmpty(params?.files)) {
        const old_files = await this.filesRepo.getAll({ dependent_id: id });
        const { itemsToAdd, itemsToRemove } = compareStringArrays(
          old_files,
          params?.files,
          'name',
        );

        if (!isEmpty(itemsToRemove)) {
          await this.filesRepo.bulkDeleteByIdsWithTransaction(
            trc,
            itemsToRemove.map((i) => i['id']),
          );
        }

        if (!isEmpty(itemsToAdd)) {
          await this.filesRepo.bulkInsertWithTransaction(
            trc,
            itemsToAdd.map((i) => ({
              dependent_id: id,
              depend: FileDependentType.organizer,
              name: i.name,
              url: i.url,
              size: i?.size,
              type: i.type,
            })),
            ['id'],
          );
        }
      }
    });
  }

  async getAllList() {
    const data = await this.repo.getAllOrganizers();
    return { data, total: Number(data[0]?.total || 0) };
  }
}
