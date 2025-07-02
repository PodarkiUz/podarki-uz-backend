import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TravelerSessionRepo } from '../repo/traveler-session.repo';

@Injectable()
export class TravelerAuthGuard implements CanActivate {
  @Inject() private readonly jwtService: JwtService;
  @Inject() private readonly sessionRepo: TravelerSessionRepo;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let authToken = request.headers['authorization'];

    // Check for HTTP Header
    if (!authToken) {
      throw new UnauthorizedException('No authorization header');
    }

    if (authToken.substring(0, 7).toLowerCase() === 'bearer ') {
      authToken = authToken.substring(7);
    }

    let decodedToken;
    try {
      // Check for valid JWT Token
      decodedToken = await this.jwtService.verifyAsync(authToken, {
        secret: 'NO_SECRET_JWT', // TODO: Use environment variable
      });
    } catch (e) {
      throw new HttpException('Invalid JWT token', 401);
    }

    if (!decodedToken) {
      throw new HttpException('Invalid JWT token', 401);
    }

    // Verify token type is for traveler
    if (decodedToken.type !== 'traveler') {
      throw new UnauthorizedException('Invalid token type for traveler access');
    }

    // Check if session exists and is valid
    const session = await this.sessionRepo.getByAccessToken(authToken);
    if (!session || session.expires_at < new Date()) {
      throw new UnauthorizedException('Session expired or invalid');
    }

    // Add user info to request
    context.switchToHttp().getRequest().user = decodedToken;
    return true;
  }
}
