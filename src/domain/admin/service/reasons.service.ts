import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ReasonRepo } from '../repo/reason.repo';
import {
  ICreateReasonParam,
  IUpdateReasonParam,
} from '../interface/reason.interface';

@Injectable()
export class ReasonsService {
  constructor(private readonly reasonRepo: ReasonRepo) {}

  async create(params: ICreateReasonParam) {
    const reason = await this.reasonRepo.insert(params);

    return { success: true, data: reason };
  }

  async delete(id: string) {
    await this.reasonRepo.updateById(id, { is_deleted: true });
    return { success: true };
  }

  async update(id: string, params: IUpdateReasonParam) {
    return this.reasonRepo.updateById(id, params);
  }

  async getAllList() {
    const data = await this.reasonRepo.getAllReasons();
    return data;
  }
}
