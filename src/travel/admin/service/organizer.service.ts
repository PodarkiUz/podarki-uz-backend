import { Injectable } from '@nestjs/common';
import { OrganizerRepo } from '../repo/organizer.repo';
import {
  IOrganizerCreateParam,
  IOrganizerUpdateParam,
} from '../interface/admin.interface';
import { OrganizerStatus } from '../admin.enum';

@Injectable()
export class OrganizerService {
  constructor(private readonly repo: OrganizerRepo) {}

  async create(params: IOrganizerCreateParam) {
    const shop = await this.repo.insert({
      status: OrganizerStatus.Registered,
      description_ru: params?.description_ru,
      description_uz: params?.description_uz,
      name: params.name,
      banner_image: params?.banner_image,
      image: params.image,
      phone: params.phone,
    });

    return { success: true, data: shop };
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
    return data;
  }
}
