export interface ICreateCategoryParam {
  name_ru: string;
  name_uz: string;
  description: string;
  image: string;
  avif_image: string;
}

export type IUpdateCategoryParam = Partial<ICreateCategoryParam>;
