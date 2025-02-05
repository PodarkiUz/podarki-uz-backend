import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../providers/auth.service';
import { AuthUserRepo } from '../repo/auth-user.repo';

@Injectable()
export class AuthorizationJwtGuard implements CanActivate {
  @Inject() private readonly jwtService: JwtService;
  @Inject() private readonly authService: AuthService;
  @Inject() private readonly userRepo: AuthUserRepo;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let authToken = request.headers['authorization'];

    // check for HTTP Header
    if (!authToken) {
      throw new UnauthorizedException('NO AUTH HEADER');
    }

    if (authToken.substring(0, 7).toLowerCase() === 'bearer ') {
      authToken = authToken.substring(7);
    }

    let decodedToken;
    try {
      // check for valid JWT Token
      decodedToken = await this.jwtService.verifyAsync(authToken, {
        secret: 'NO_SECRET_JWT',
      });
    } catch (e) {
      throw new HttpException('INVALID JWT TOKEN', 401);
    }

    if (!decodedToken) {
      throw new HttpException('INVALID JWT TOKEN', 401);
    }

    context.switchToHttp().getRequest().user = decodedToken;
    return true;
  }
}
