import { IAuthGetUserInfo } from 'src/travel/core/auth/interface/user.interface';
import { Role } from 'src/travel/core/auth/role.enum';
import { ILanguage } from 'src/travel/shared/interfaces';

export type ICurrentUser = IAuthGetUserInfo;

export interface ICurrentOrganizer {
  id: string;
  title: ILanguage;
  phone: string;
  role: Role;
}
