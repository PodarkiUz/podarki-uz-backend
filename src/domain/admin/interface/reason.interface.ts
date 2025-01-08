import { FilesEntity } from '../entity/product.entity';

export interface ICreateReasonParam {
  name_ru: string;
  name_uz: string;
  description_ru?: string;
  description_uz?: string;
  image: FilesEntity;
}

export type IUpdateReasonParam = Partial<ICreateReasonParam>;

export interface IGetAllReasonListResponse {
  reason: ICreateReasonParam;
}
