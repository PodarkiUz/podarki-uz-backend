export interface IAuthGetUserInfo {
  id: string;
  phone: string;
  first_name: string;
  last_name: string;
  status: number;
  created_at: Date;
}

export interface IRegionJson {
  id: string;
  name_uz: string;
  name_ru: string;
  name_uzl: string;
}
