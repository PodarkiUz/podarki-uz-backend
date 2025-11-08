import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createHash } from 'crypto';
import { WishlistUserRepo } from 'src/travel/shared/repo/wishlist-user.repo';
import { WishlistSignInDto, WishlistSignUpDto } from '../dto/wishlist-auth.dto';

@Injectable()
export class WishlistAuthService {
  constructor(private readonly wishlistUserRepo: WishlistUserRepo) { }

  async signUp(payload: WishlistSignUpDto) {
    const existing = await this.wishlistUserRepo.findByLogin(payload.login);
    if (existing) {
      throw new ConflictException('Login already taken');
    }

    const password = this.hashPassword(payload.password);
    const user = await this.wishlistUserRepo.insert({
      login: payload.login,
      password,
    });

    return {
      id: user.id,
      login: user.login,
    };
  }

  async signIn(payload: WishlistSignInDto) {
    const user = await this.wishlistUserRepo.findByLogin(payload.login);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const hashed = this.hashPassword(payload.password);
    if (user.password !== hashed) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      id: user.id,
      login: user.login,
    };
  }

  private hashPassword(password: string) {
    return createHash('md5').update(password).digest('hex');
  }
}
