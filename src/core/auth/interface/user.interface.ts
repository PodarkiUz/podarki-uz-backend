export interface IAuthGetUserInfo {
  id: string;
  username: string;
  is_active: boolean;
  first_name: string;
  last_name: string;
  middle_name: string;
  is_verified: boolean;
  roles: string[];
  permissions: string[];
  region: IRegionJson;
}

export interface IRegionJson {
  id: string;
  name_uz: string;
  name_ru: string;
  name_uzl: string;
}
