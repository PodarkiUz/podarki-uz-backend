import { Injectable } from '@nestjs/common';
import { BaseRepo } from '@shared/providers/base-dao';
import { auth_token } from '@shared/constants/tableNames';

@Injectable()
export class AuthTokenRepo extends BaseRepo<any> {
  constructor() {
    super(auth_token.name);
  }
}
