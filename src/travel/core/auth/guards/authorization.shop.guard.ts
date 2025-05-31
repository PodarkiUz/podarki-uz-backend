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

@Injectable()
export class AuthorizationJwtShopGuard implements CanActivate {
  @Inject() private readonly jwtService: JwtService;
  @Inject() private readonly authService: AuthService;

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
        secret: 'NO_SHOP_SECRET_JWT',
      });
    } catch (e) {
      throw new HttpException('INVALID JWT TOKEN', 401);
    }

    if (!decodedToken) {
      throw new HttpException('INVALID JWT TOKEN', 401);
    }

    // check decodedToken in auth_token
    const token = await this.authService.checkTokenFromDatabase({
      token: authToken,
    });

    if (!token) {
      throw new UnauthorizedException("TOKEN DOESN'T EXIST");
    }

    context.switchToHttp().getRequest().token = token;
    context.switchToHttp().getRequest().user = decodedToken;
    return true;
  }
}
