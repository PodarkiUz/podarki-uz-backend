export interface ICreateCategoryParam {
  name_ru: string;
  name_uz: string;
  description: string;
  image: string;
  avif_image: string;
  parent_id?: string;
  group_id?: string;
}

export type IUpdateCategoryParam = Partial<ICreateCategoryParam>;
