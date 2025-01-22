import { OrganizerStatus } from '../admin.enum';

export interface TourEntity {
  id?: string;
  name_uz: string;
  name_ru: string;
  description_uz?: string;
  description_ru?: string;
  location: number;
  price: number;
  status: OrganizerStatus;
  sale_price?: number;
  duration?: string;
  start_date: string;
  organizer_id: string;
  seats: number;
  created_at?: Date;
  is_deleted?: boolean;
  search_vector: string;
}
