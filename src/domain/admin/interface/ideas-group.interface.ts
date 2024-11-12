export interface ICreateIdeasGroupParam {
  name_ru: string;
  name_uz: string;
  reason_id?: string;
  is_main?: boolean;
}

export type IUpdateIdeasGroupParam = Partial<ICreateIdeasGroupParam>;

export interface IGetAllIdeasGroupListResponse {
  ideas_group: ICreateIdeasGroupParam;
}
