import { FilesEntity } from '@domain/admin/entity/product.entity';
import { OrganizerStatus } from '../admin.enum';
import { OrganizerBannerFilesEntity } from '../entity/admin.entity';

export interface IShopUserInfoForJwtPayload {
  shop_id: string;
  owner_user_id: string;
  user_phone: string;
  user_last_name: string;
  user_first_name: string;
  shop_name: string;
  status: OrganizerStatus;
}

export interface IOrganizerCreateParam {
  name: string;
  description_uz?: string;
  description_ru?: string;
  image?: FilesEntity;
  banner_image?: OrganizerBannerFilesEntity;
  phone: string;
}

export interface IOrganizerUpdateParam {
  id?: string;
  name?: string;
  description_uz?: string;
  description_ru?: string;
  image?: FilesEntity;
  banner_image?: OrganizerBannerFilesEntity;
  phone?: string;
}
