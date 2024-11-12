import { BaseRepo } from '@shared/providers/base-dao';
import { Injectable } from '@nestjs/common';
import { UserHolidaysEntity } from '../entity/user-holidays.entity';

@Injectable()
export class UserHolidaysRepo extends BaseRepo<UserHolidaysEntity> {
  constructor() {
    super('user_holidays');
  }

  getAllUserHolidays(user_id: string) {
    return this.getAll({ is_deleted: false, user_id });
  }
}
