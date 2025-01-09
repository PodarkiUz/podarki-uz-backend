import { FilesEntity } from '@domain/admin/entity/product.entity';
import { ShopStatus } from '../shop.enum';

export interface ShopEntity {
  id?: string;
  owner_user_id: string;
  name?: string;
  description_uz?: string;
  description_ru?: string;
  image?: FilesEntity;
  banner_image?: ShopBannerFilesEntity;
  status: ShopStatus;
  created_at?: Date;
  is_deleted?: boolean;
}

export interface ShopBannerFilesEntity {
  imageOriginal: string;
  imageWebp: string;
}
