import { FileDto, IncludesDto, RouteDto } from 'src/travel/shared/dtos';
import { CurrencyType, OrganizerStatus } from 'src/travel/shared/enums';
import { ILanguage } from 'src/travel/shared/interfaces';
import { TourDetailsDto } from '../dto/tour.dto';

export interface ITourCreateParam {
  title: ILanguage;
  description?: ILanguage;
  status: OrganizerStatus;
  location: number;
  price: number;
  sale_price?: number;
  currency: CurrencyType;
  duration?: string;
  start_date: string;
  seats: number;
  files?: FileDto[];
  route?: RouteDto[];
  includes?: IncludesDto[];
  details?: TourDetailsDto;
}

export interface ITourUpdateParam {
  id?: string;
  title?: ILanguage;
  description?: ILanguage;
  location?: number;
  price?: number;
  sale_price?: number;
  duration?: string;
  start_date?: string;
  organizer_id?: string;
  seats?: number;
  files?: FileDto[];
  route_json?: RouteDto[];
  includes?: IncludesDto[];
  details?: TourDetailsDto;
}

export interface ITourSeachByName {
  keyword?: string;
  location?: number;
  from_price?: number;
  to_price?: number;
  from_date?: string;
  to_date?: string;
  seats?: number;
}
