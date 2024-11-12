export interface ICreateIdeasParam {
  name_ru: string;
  name_uz: string;
  description_ru?: string;
  description_uz?: string;
  group_id?: string;
}

export type IUpdateIdeasParam = Partial<ICreateIdeasParam>;

export interface IGetAllIdeasListResponse {
  reason: ICreateIdeasParam;
}

export interface ICreateIdeasFilterParam {
  filter_value_id: string;
  idea_id: string;
}
