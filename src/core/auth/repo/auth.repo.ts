import { BaseRepo } from '@shared/providers/base-dao';
import { Inject, Injectable } from '@nestjs/common';
import { AuthTokenRepo } from '@shared/repos/authToken.repo';
import { UsersRepo } from '@shared/repos/users.repo';
import { auth_token, users } from '@shared/constants/tableNames';
import { AuthToken } from '../types';

@Injectable()
export class AuthUserDao extends BaseRepo<AuthToken> {
  @Inject() private readonly authTokenRepo: AuthTokenRepo;
  @Inject() usersRepo: UsersRepo;

  constructor() {
    super(auth_token.name);
  }

  createToken(user_id, decodedToken, accessToken, refreshToken) {
    return this.authTokenRepo.insert({
      user_id,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: new Date(decodedToken.exp * 1000),
    });
  }

  getUserByUsername(username) {
    const user = this.knex
      .select('*')
      .from(users.name)
      .where('username', username)
      .whereNot('is_deleted', true)
      .first();

    return user;
  }

  removeAllAuthTokensOfUser(user_id) {
    return this.knex.transaction((trx) => {
      return trx(auth_token.name)
        .update({
          is_deleted: true,
        })
        .where('user_id', user_id)
        .andWhere('is_deleted', false)
        .returning('*');
    });
  }

  async getToken(token: any): Promise<AuthToken> {
    const knex = this.knex;
    const query = knex
      .select([
        'id',
        'created_at',
        'user_id',
        'access_token',
        'expires_at',
        'is_deleted',
        this._knex.raw(
          `case when (now() < expires_at::timestamp) then false else true end as is_expired`,
        ),
      ])
      .from(this.tableName)
      .where('access_token', token)
      .andWhereNot('is_deleted', true)
      .first();

    return query;
  }

  async getByRefreshToken(token: any, trx?): Promise<AuthToken> {
    const knex = trx ? trx : this.knex;
    const query = knex
      .select(['id', 'user_id'])
      .from(this.tableName)
      .where('refresh_token', token)
      .andWhereNot('is_deleted', true)
      .first();

    return query;
  }
}
