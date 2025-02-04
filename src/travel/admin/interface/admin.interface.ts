import { FileDto } from 'src/travel/shared/dtos';
import { OrganizerStatus } from '../admin.enum';
import { ILanguage } from 'src/travel/shared/interfaces';

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
  title: ILanguage;
  description?: ILanguage;
  phone: string;
  files?: FileDto[];
}

export interface IOrganizerUpdateParam {
  id?: string;
  name?: string;
  description_uz?: string;
  description_ru?: string;
  phone?: string;
}
