import { FileType, OrganizerStatus } from '../enums';
import { ILanguage } from '../interfaces';

export interface TourEntity {
  id?: string;
  title: ILanguage;
  description?: ILanguage;
  location: number;
  price: number;
  status: OrganizerStatus;
  sale_price?: number;
  duration?: string;
  start_date: string;
  end_date: string;
  organizer_id: string;
  seats: number;
  created_at?: Date;
  is_deleted?: boolean;
}

export interface CityEntity {
  id?: string;
  title: ILanguage;
  country?: ILanguage;
}

export interface OrganizerEntity {
  id?: string;
  title: ILanguage;
  description?: ILanguage;
  status: OrganizerStatus;
  phone: string;
  created_at?: Date;
  is_deleted?: boolean;
}

export interface FilesEntity {
  id?: string;
  name: string;
  size?: number;
  depend: string;
  dependent_id: string;
  type: FileType;
  created_at?: Date;
  is_deleted?: boolean;
}

export interface ReviewEntity {
  id?: string;
  title?: string;
  user_id: string;
  tour_id: string;
  created_at?: Date;
  is_deleted?: boolean;
}
