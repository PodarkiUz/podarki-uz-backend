import { Injectable } from '@nestjs/common';
import { UserHolidaysRepo } from '../repo/user-holidays.repo';
import {
  ICreateUserHolidaysParam,
  IGetUserHolidays,
  IUpdateUserHolidayParam,
} from '../interface/user-holidays.interface';
import { ICurrentUser } from '@shared/interfaces/current-user';

@Injectable()
export class UserHolidaysService {
  constructor(private readonly userHolidaysRepo: UserHolidaysRepo) {}

  async create(params: ICreateUserHolidaysParam, currentUser: ICurrentUser) {
    const reason = await this.userHolidaysRepo.insert({
      ...params,
      user_id: currentUser.id,
    });

    return { success: true, data: reason };
  }

  async delete(id: string) {
    await this.userHolidaysRepo.updateById(id, { is_deleted: true });
    return { success: true };
  }

  async update(id: string, params: IUpdateUserHolidayParam) {
    return this.userHolidaysRepo.updateById(id, params);
  }

  async getAllList(param: IGetUserHolidays) {
    const data = await this.userHolidaysRepo.getAllUserHolidays(param.user_id);
    return data;
  }
}
