import { OrganizerStatus } from '../admin.enum';

export interface ITourCreateParam {
  name_uz: string;
  name_ru: string;
  description_uz?: string;
  description_ru?: string;
  status: OrganizerStatus;
  location: number;
  price: number;
  sale_price?: number;
  duration?: string;
  start_date: string;
  organizer_id: string;
  seats: number;
}

export interface ITourUpdateParam {
  id?: string;
  name_uz?: string;
  name_ru?: string;
  description_uz?: string;
  description_ru?: string;
  location?: number;
  price?: number;
  sale_price?: number;
  duration?: string;
  start_date?: string;
  organizer_id?: string;
  seats?: number;
}

export interface ITourSeachByName {
  keyword?: string;
  location?: number;
  from_price?: number;
  to_price?: number;
}
