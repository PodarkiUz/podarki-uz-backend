import { TourDifficulty, TourType } from 'src/travel/admin/dto/tour.dto';
import { PaginationParams } from 'src/travel/shared/interfaces';

export enum TourOrderTypes {
  Popular = 'popular',
  Newest = 'newest',
  PriceLowToHigh = 'price_low_to_high',
  PriceHighToLow = 'price_high_to_low',
}

export class IGetTourListClient extends PaginationParams {
  from_date?: string;
  to_date?: string;
  location?: number;
  from_price?: number;
  to_price?: number;
  tour_type?: TourType;
  difficulty?: TourDifficulty;
  order_by?: TourOrderTypes;
}
