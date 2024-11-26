import { FilesEntity } from '../entity/product.entity';

export interface ICreateIdeasParam {
  name_ru: string;
  name_uz: string;
  description_ru?: string;
  description_uz?: string;
  group_id?: string;
  image?: FilesEntity;
  filters: ICreateIdeasFilterProp[];
}

export interface ICreateIdeasFilterProp {
  filter_id: string;
  values: string[];
}

export type IUpdateIdeasParam = Partial<ICreateIdeasParam>;

export interface IGetAllIdeasListResponse {
  reason: ICreateIdeasParam;
}

export interface ICreateIdeasFilterParam {
  filter_value_id: string;
  idea_id: string;
}
