export interface ICreateFilterParam {
  name_ru: string;
  name_uz: string;
  values: IFilterValues[];
}

export type IUpdateFilterParam = Partial<ICreateFilterParam>;

export interface IGetAllFiltersListResponse {
  reason: ICreateFilterParam;
}

export interface IFilterValues {
  name_ru: string;
  name_uz: string;
}

export interface ICreateFilterValueParam {
  filter_id: string;
  values: IFilterValues[];
}
