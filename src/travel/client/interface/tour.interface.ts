import { PaginationParams } from 'src/travel/shared/interfaces';

export class IGetTourListClient extends PaginationParams {
  from_date?: string;
  to_date?: string;
  location?: number;
  from_price?: number;
  to_price?: number;
}
