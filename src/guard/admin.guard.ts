import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRoles } from 'src/domain/client/user/enum/user.enum';
import { IUser } from 'src/domain/client/user/interface/user.interface';
import { UserService } from 'src/domain/client/user/user.service';
import { UserHasNotPermissionException } from 'src/errors/permission.error';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    if (!token) {
      throw new UnauthorizedException();
    }

    // tokenId = tokenId.substring('Bearer '.length);
    let user;
    try {
      user = await this.jwtService.verifyAsync(token, {
        secret: `podarkiuz-app`,
      });
    } catch (error) {
      throw new ForbiddenException();
    }

    // const user: IUser = await this.userService.findOne(token.id);

    // if (!user || !user.id) {
    //   throw new UnauthorizedException();
    // }

    if (user.role !== UserRoles.ADMIN) {
      throw new UserHasNotPermissionException();
    }

    request.user = user;

    return true;
  }
}
