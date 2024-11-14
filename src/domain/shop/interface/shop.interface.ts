import { ShopStatus } from '../shop.enum';

export interface IShopUserInfoForJwtPayload {
  shop_id: string;
  owner_user_id: string;
  user_phone: string;
  user_last_name: string;
  user_first_name: string;
  shop_name: string;
  status: ShopStatus;
}
