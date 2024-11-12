export interface UserHolidaysEntity {
  id?: string;
  user_id: string;
  holiday_name: string;
  description: string;
  holiday_date: Date;
  notification_date?: Date;
  created_at?: Date;
  is_deleted?: boolean;
}
