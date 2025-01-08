import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthUserDao } from '../repo/auth.repo';
import { JwtService } from '@nestjs/jwt';
import { AuthToken } from '../types';
import { ClientAuthorizeDto } from '../dto/authorize.dto';
import getFiveDigitNumberOTP from '@shared/utils/otp-generator';
import { UserNotFoundException } from '@shared/errors/permission.error';
import { UsersRepo } from '@shared/repos/users.repo';
import { UserStatus } from '../role.enum';
import { ShopRepo } from '@domain/shop/repo/shop.repo';
import { ShopStatus } from '@domain/shop/shop.enum';
import { IAuthGetUserInfo } from '../interface/user.interface';
import { AuthUserRepo } from '../repo/auth-user.repo';
import { ShopEntity } from '@domain/shop/entity/shop.entity';
import { isEmpty } from 'lodash';
import { IShopUserInfoForJwtPayload } from '@domain/shop/interface/shop.interface';

@Injectable()
export class AuthService {
  @Inject() private readonly authUserDao: AuthUserDao;
  @Inject() private readonly userRepo: UsersRepo;
  @Inject() private readonly authUserRepo: AuthUserRepo;
  @Inject() private readonly shopRepo: ShopRepo;
  @Inject() readonly jwtService: JwtService;

  async createUserToken(user: IAuthGetUserInfo) {
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
    return { accessToken, refreshToken, success: true };
  }

  async createShopToken(shop: IShopUserInfoForJwtPayload) {
    const accessToken = await this.jwtService.signAsync(
      { ...shop },
      {
        expiresIn: '23h',
        secret: 'NO_SHOP_SECRET_JWT',
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { id: shop.shop_id },
      {
        expiresIn: '14d',
        secret: 'NO_SHOP_SECRET_JWT',
      },
    );

    const decodedToken = this.jwtService.decode(accessToken, { json: true });
    await this.authUserDao.createToken(
      shop.owner_user_id,
      decodedToken,
      accessToken,
      refreshToken,
    );
    return { accessToken, refreshToken, success: true };
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

      return this.createUserToken(user);
    });
  }

  async clientAuthorize(
    params: ClientAuthorizeDto,
  ): Promise<{ success: boolean; otp: string }> {
    return this.authUserDao.knex.transaction(async (trx) => {
      const user = await this.checkUserByPhone(params.phone);
      const otp = getFiveDigitNumberOTP().toString();
      const hashedOtp = bcrypt.hashSync(otp, 10);

      if (user) {
        await this.userRepo.updateByIdWithTransaction(trx, user.id, {
          otp: hashedOtp,
        });
      } else {
        await this.userRepo.insertWithTransaction(trx, {
          phone: params.phone,
          otp: hashedOtp,
          status: UserStatus.New,
        });
      }

      return { success: true, otp };
    });
  }

  async checkUserByPhone(
    phone: string,
  ): Promise<{ id: string; username: string }> {
    const user = await this.authUserDao.getUserByPhone(phone);
    if (!user) return null;
    return user;
  }

  async checkShopByOwnerPhone(phone: string): Promise<ShopEntity> {
    const shop = await this.shopRepo.getShopByOwnerPhone(phone);
    if (!shop) return null;
    return shop;
  }

  async confirmOtp(
    phone: string,
    otpCode: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.authUserDao.getUserByPhone(phone);

    if (!user) {
      throw new UserNotFoundException();
    }

    if (!user.otp) {
      throw new Error();
    }

    if (!bcrypt.compareSync(otpCode, user.otp)) {
      throw new BadRequestException('INCORRECT CODE');
    }

    return this.authUserDao.knex.transaction(async (trx) => {
      await this.userRepo.updateByIdWithTransaction(trx, user.id, {
        status: UserStatus.Registered,
        otp: null,
      });

      return await this.createUserToken(user);
    });
  }

  async confirmShopOtp(
    phone: string,
    otpCode: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.authUserDao.getUserByPhone(phone);

    if (!user) {
      throw new UserNotFoundException();
    }

    const shop = await this.shopRepo.getShopForJwtPayloadById(user.id);

    if (!user) {
      throw new UserNotFoundException();
    }

    if (!user.otp) {
      throw new BadRequestException();
    }

    if (!bcrypt.compareSync(otpCode, user.otp)) {
      throw new BadRequestException('INCORRECT CODE');
    }

    return this.authUserDao.knex.transaction(async (trx) => {
      await this.userRepo.updateByIdWithTransaction(trx, shop.owner_user_id, {
        status: UserStatus.Registered,
        otp: null,
      });

      await this.shopRepo.updateByIdWithTransaction(trx, shop.shop_id, {
        status: ShopStatus.Registered,
      });
      // const payload = await this.authUserRepo.getUserInfo
      return await this.createShopToken(shop);
    });
  }

  async shopAuthorize(
    params: ClientAuthorizeDto,
  ): Promise<{ success: boolean; otp: string }> {
    return this.authUserDao.knex.transaction(async (trx) => {
      const shop = await this.checkShopByOwnerPhone(params.phone);
      const otp = getFiveDigitNumberOTP().toString();
      const hashedOtp = bcrypt.hashSync(otp, 10);

      if (!isEmpty(shop)) {
        await this.userRepo.updateByIdWithTransaction(trx, shop.owner_user_id, {
          otp: hashedOtp,
        });
      } else {
        const shop_owner = await this.userRepo.insertWithTransaction(trx, {
          phone: params.phone,
          otp: hashedOtp,
          status: UserStatus.New,
        });

        await this.shopRepo.insertWithTransaction(trx, {
          owner_user_id: shop_owner.id,
          status: ShopStatus.New,
        });
      }

      return { success: true, otp };
    });
  }
}
