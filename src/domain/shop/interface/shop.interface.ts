import { FilesEntity } from '@domain/admin/entity/product.entity';
import { ShopStatus } from '../shop.enum';
import { ShopBannerFilesEntity } from '../entity/shop.entity';

export interface IShopUserInfoForJwtPayload {
  shop_id: string;
  owner_user_id: string;
  user_phone: string;
  user_last_name: string;
  user_first_name: string;
  shop_name: string;
  status: ShopStatus;
}

export interface IShopCreateParam {
  name: string;
  description_uz?: string;
  description_ru?: string;
  image: FilesEntity;
  banner_image?: ShopBannerFilesEntity;
}

export interface IShopUpdateParam {
  id?: string;
  name?: string;
  description_uz?: string;
  description_ru?: string;
  image?: FilesEntity;
  banner_image?: ShopBannerFilesEntity;
}
