import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ICurrentShop } from 'src/domain/cabinet/interface/shop.interface';

@Injectable()
export class CabinetGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    if (!token) {
      throw new UnauthorizedException();
    }

    // tokenId = tokenId.substring('Bearer '.length);
    let shop: ICurrentShop;
    try {
      shop = await this.jwtService.verifyAsync(token, {
        secret: `podarkiuz-app`,
      });
    } catch (error) {
      throw new ForbiddenException();
    }

    request.shop = shop;

    return true;
  }
}
