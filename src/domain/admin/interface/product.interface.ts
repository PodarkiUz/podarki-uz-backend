import { FilesEntity } from '../entity/product.entity';

export interface ICreateProductParam {
  name_ru: string;
  name_uz: string;
  description_ru?: string;
  description_uz?: string;
  price: number;
  sale_price?: number;
  category_id?: string;
  files: Array<FilesEntity>;
}

export type IUpdateProductParam = Partial<ICreateProductParam>;

export interface IGetAllProductListResponse {
  product: ICreateProductParam;
}

export interface ICreateProductFilterParam {
  filter_value_id: string;
  product_id: string;
}
