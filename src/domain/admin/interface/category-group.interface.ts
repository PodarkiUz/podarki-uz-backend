export interface ICreateCategoryGroupParam {
  name_ru: string;
  name_uz: string;
}

export type IUpdateCategoryGroupParam = Partial<ICreateCategoryGroupParam>;
