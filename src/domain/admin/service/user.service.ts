import { BadRequestException, Injectable } from '@nestjs/common';
import { AdminUserRepo } from '../repo/user.repo';
import {
  AdminSignInDto,
  CreateAdminDto,
  SetUserStatusDto,
} from '../dto/user-admin.dto';
import { isEmpty } from 'lodash';
import {
  AdminPasswordIncorrectException,
  EmailAlreadyRegistered,
  UserNotFoundException,
} from 'src/errors/permission.error';
import { ListPageDto } from 'src/shared/dto/list.dto';
import { UserRoles, UserStatus } from 'src/domain/user/enum/user.enum';
import { IUser } from 'src/domain/user/interface/user.interface';
import { JwtService } from '@nestjs/jwt';
import {
  createHashPassword,
  verifyPassword,
} from 'src/shared/utils/password-hash';

@Injectable()
export class AdminUserService {
  constructor(
    private readonly adminUserRepo: AdminUserRepo,
    private readonly jwtService: JwtService,
  ) { }

  setStatus(params: SetUserStatusDto) {
    return this.adminUserRepo.updateById(params.user_id, {
      status: params.status,
    });
  }

  findAll(params: ListPageDto) {
    return this.adminUserRepo.select(
      {
        is_deleted: false,
      },
      {
        limit: params.per_page,
        offset: params.page,
        order_by: { column: 'created_at', order: 'desc', use: true },
      },
    );
  }

  async delete(id: string) {
    const user = await this.adminUserRepo.selectById(id);

    if (isEmpty(user)) {
      throw new UserNotFoundException();
    }

    await this.adminUserRepo.softDelete(id);

    return { success: true };
  }

  async adminSignIn(params: AdminSignInDto) {
    const admin = await this.adminUserRepo.selectByUsername(params.username);

    if (isEmpty(admin)) {
      throw new UserNotFoundException();
    }

    const isPasswordValid = await verifyPassword(
      params.password,
      admin.password,
    );

    if (!isPasswordValid) {
      throw new AdminPasswordIncorrectException();
    }

    return {
      access_token: await this.jwtService.signAsync(
        { id: admin.id, email: params.username, role: UserRoles.ADMIN },
        { privateKey: 'podarkiuz-app' },
      ),
    };
  }

  async createSuperAdmin(params: CreateAdminDto) {
    const hasUsername: IUser = await this.adminUserRepo.selectByUsername(
      params.username,
    );

    if (hasUsername) {
      throw new EmailAlreadyRegistered();
    }

    const [user]: [IUser] = await this.adminUserRepo.insert({
      role: UserRoles.ADMIN,
      status: UserStatus.ACTIVE,
      username: params.username,
      password: await createHashPassword(params.password),
      phone: params.phone,
      first_name: params.first_name,
      last_name: params.last_name,
    });

    return user;
  }

  findAllAdmins(params: ListPageDto) {
    return this.adminUserRepo.select(
      {
        is_deleted: false,
        role: UserRoles.ADMIN,
      },
      {
        limit: params.per_page,
        offset: params.page,
        order_by: { column: 'created_at', order: 'desc', use: true },
      },
    );
  }
}
