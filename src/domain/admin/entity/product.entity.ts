export interface ProductEntity {
  id?: string;
  name_ru: string;
  name_uz: string;
  description_ru?: string;
  description_uz?: string;
  price: number;
  sale_price?: number;
  category_id?: string;
  files: Array<FilesEntity> | string;
  shop_id: string;
  created_at?: Date;
  is_deleted?: boolean;
}

export interface FilesEntity {
  imageOriginal: string;
  image360: string;
  image768: string;
  image1920: string;
}

export interface ProductFiltersEntity {
  id?: string;
  product_id: string;
  filter_value_id: string;
}
