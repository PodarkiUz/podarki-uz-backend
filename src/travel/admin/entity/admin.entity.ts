import { FilesEntity } from '@domain/admin/entity/product.entity';
import { OrganizerStatus } from '../admin.enum';

export interface OrganizerEntity {
  id?: string;
  name: string;
  description_uz?: string;
  description_ru?: string;
  image?: FilesEntity;
  banner_image?: OrganizerBannerFilesEntity;
  status: OrganizerStatus;
  phone: string;
  created_at?: Date;
  is_deleted?: boolean;
}

export interface OrganizerBannerFilesEntity {
  imageOriginal: string;
  imageWebp: string;
}
