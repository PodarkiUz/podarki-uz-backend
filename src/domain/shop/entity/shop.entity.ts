import { ShopStatus } from '../shop.enum';

export interface ShopEntity {
  id?: string;
  owner_user_id: string;
  name?: string;
  status: ShopStatus;
  created_at?: Date;
  is_deleted?: boolean;
}
