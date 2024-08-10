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
export class RootGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const basicToken = request.headers?.basic;

    if (!basicToken || basicToken !== 'YWRtaW4xOmFkbWluMQ==') {
      throw new UnauthorizedException();
    }

    return true;
  }
}
