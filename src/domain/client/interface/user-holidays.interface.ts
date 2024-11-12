export interface ICreateUserHolidaysParam {
  user_id: string;
  holiday_name: string;
  description: string;
  holiday_date: Date;
  notification_date?: Date;
}

export type IUpdateUserHolidayParam = Partial<ICreateUserHolidaysParam>;

export interface IGetAllUserHolidaysListResponse {
  product: ICreateUserHolidaysParam;
}

export interface IGetUserHolidays {
  user_id: string;
}
