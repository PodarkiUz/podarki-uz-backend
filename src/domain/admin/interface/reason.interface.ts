export interface ICreateReasonParam {
  name_ru: string;
  name_uz: string;
  description_ru?: string;
  description_uz?: string;
}

export type IUpdateReasonParam = Partial<ICreateReasonParam>;

export interface IGetAllReasonListResponse {
  reason: ICreateReasonParam;
}
