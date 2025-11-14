import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createHash } from 'crypto';
import { WishlistUserRepo } from 'src/travel/shared/repo/wishlist-user.repo';
import {
  WishlistSignInDto,
  WishlistSignUpDto,
  WishlistTelegramAuthDto,
} from '../dto/wishlist-auth.dto';
import { verifyTelegramAuthData } from '@shared/utils/telegram-hash';

@Injectable()
export class WishlistAuthService {
  private readonly botToken: string;

  constructor(private readonly wishlistUserRepo: WishlistUserRepo) {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN || '';
    if (!this.botToken) {
      console.warn(
        'TELEGRAM_BOT_TOKEN is not set. Telegram authentication will not work.',
      );
    }
  }

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

  async signUpWithTelegram(payload: WishlistTelegramAuthDto) {
    // Verify Telegram hash
    if (!this.botToken) {
      throw new BadRequestException('Telegram bot token not configured');
    }

    const isValid = verifyTelegramAuthData(payload, this.botToken);
    if (!isValid) {
      throw new UnauthorizedException('Invalid Telegram authentication data');
    }

    // Check if auth_date is not too old (24 hours)
    const authDate = new Date(payload.auth_date * 1000);
    const now = new Date();
    const hoursDiff = (now.getTime() - authDate.getTime()) / (1000 * 60 * 60);
    if (hoursDiff > 24) {
      throw new BadRequestException('Telegram authentication data expired');
    }

    // Check if user already exists
    const existing = await this.wishlistUserRepo.findByTelegramId(payload.id);
    if (existing) {
      throw new ConflictException('User already exists with this Telegram ID');
    }

    // Create new user
    const user = await this.wishlistUserRepo.insert({
      telegram_id: payload.id,
      first_name: payload.first_name,
      last_name: payload.last_name,
      username: payload.username,
      photo_url: payload.photo_url,
    });

    return {
      id: user.id,
      telegram_id: user.telegram_id,
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      photo_url: user.photo_url,
    };
  }

  async signInWithTelegram(payload: WishlistTelegramAuthDto) {
    // Verify Telegram hash
    if (!this.botToken) {
      throw new BadRequestException('Telegram bot token not configured');
    }

    const isValid = verifyTelegramAuthData(payload, this.botToken);
    if (!isValid) {
      throw new UnauthorizedException('Invalid Telegram authentication data');
    }

    // Check if auth_date is not too old (24 hours)
    const authDate = new Date(payload.auth_date * 1000);
    const now = new Date();
    const hoursDiff = (now.getTime() - authDate.getTime()) / (1000 * 60 * 60);
    if (hoursDiff > 24) {
      throw new BadRequestException('Telegram authentication data expired');
    }

    // Find user by Telegram ID
    let user = await this.wishlistUserRepo.findByTelegramId(payload.id);

    if (!user) {
      // Create new user if doesn't exist
      user = await this.wishlistUserRepo.insert({
        telegram_id: payload.id,
        first_name: payload.first_name,
        last_name: payload.last_name,
        username: payload.username,
        photo_url: payload.photo_url,
      });
    } else {
      // Update user info if exists
      user = await this.wishlistUserRepo.updateById(user.id, {
        first_name: payload.first_name,
        last_name: payload.last_name,
        username: payload.username,
        photo_url: payload.photo_url,
      });
    }

    return {
      id: user.id,
      telegram_id: user.telegram_id,
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      photo_url: user.photo_url,
    };
  }

  private hashPassword(password: string) {
    return createHash('md5').update(password).digest('hex');
  }
}
