import * as bcrypt from 'bcrypt';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthUserDao } from '../repo/auth.repo';
import { JwtService } from '@nestjs/jwt';
import { AuthToken } from '../types';

@Injectable()
export class AuthService {
  @Inject() private readonly authUserDao: AuthUserDao;
  @Inject() readonly jwtService: JwtService;
  async createToken(user) {
    const accessToken = await this.jwtService.signAsync(
      { ...user },
      {
        expiresIn: '23h',
        secret: 'NO_SECRET_JWT',
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { id: user.id },
      {
        expiresIn: '14d',
        secret: 'NO_SECRET_JWT',
      },
    );

    const decodedToken = this.jwtService.decode(accessToken, { json: true });
    await this.authUserDao.createToken(
      user.id,
      decodedToken,
      accessToken,
      refreshToken,
    );
    return { accessToken, refreshToken };
  }

  async checkUser(
    username: string,
    password: string,
  ): Promise<{ id: string; username: string }> {
    const user = await this.authUserDao.getUserByUsername(username);
    if (!user) return null;
    if (!bcrypt.compareSync(password, user.password)) {
      return null;
    }
    delete user.password;
    return user;
  }

  logout(id: any) {
    return this.authUserDao.removeAllAuthTokensOfUser(id);
  }

  async checkTokenFromDatabase(params: { token: any }): Promise<AuthToken> {
    const tokenData = await this.authUserDao.getToken(params.token);
    if (!tokenData) {
      return null;
    }

    if (tokenData && tokenData.is_expired) {
      return null;
    }

    if (tokenData.is_deleted) {
      return null;
    }

    return tokenData;
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authUserDao.knex.transaction(async (trx) => {
      const verified = await this.jwtService.verifyAsync(refreshToken, {
        secret: 'NO_SECRET_JWT',
      });

      if (!verified) {
        throw new UnauthorizedException('INVALID REFRESH TOKEN');
      }

      const token = await this.authUserDao.getByRefreshToken(refreshToken, trx);
      if (!token) {
        throw new UnauthorizedException('INVALID REFRESH TOKEN');
      }

      await this.authUserDao.updateByIdWithTransaction(trx, token.id, {
        is_deleted: true,
      });

      const user = await this.authUserDao.usersRepo.getUserInfo(
        token.user_id,
        trx,
      );

      return this.createToken(user);
    });
  }
}
