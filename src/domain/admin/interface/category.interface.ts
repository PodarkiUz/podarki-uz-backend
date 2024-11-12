import { FilesEntity } from '../entity/product.entity';

export interface ICreateCategoryParam {
  name_ru: string;
  name_uz: string;
  description: string;
  image: FilesEntity;
  parent_id?: string;
  group_id?: string;
}

export type IUpdateCategoryParam = Partial<ICreateCategoryParam>;

export interface IGetAllCategoryListResponse {
  category: ICreateCategoryParam;
}
