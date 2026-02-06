import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

export interface GoogleUserInfo {
  sub: string; // Google user ID
  email: string;
  email_verified: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

@Injectable()
export class GoogleOAuthService {
  private readonly client: OAuth2Client;

  constructor() {
    // Initialize Google OAuth2 client
    // You'll need to set these environment variables:
    // GOOGLE_CLIENT_ID - Your Google OAuth2 client ID
    // GOOGLE_CLIENT_SECRET - Your Google OAuth2 client secret (optional for ID token verification)
    this.client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    );
  }

  async verifyIdToken(idToken: string, client?: string): Promise<GoogleUserInfo> {
    const clientId = client === 'weesh' ? process.env.WEESH_GOOGLE_CLIENT_ID : process.env.GOOGLE_CLIENT_ID;
    if (!clientId?.trim()) {
      console.error('GOOGLE_CLIENT_ID is not set. Set it to the same value as the frontend (e.g. NEXT_PUBLIC_GOOGLE_CLIENT_ID).');
      throw new UnauthorizedException('Google sign-in is not configured');
    }

    try {
      // Audience must match the client ID that issued the token (your frontend Web client ID).
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: clientId.trim(),
      });

      const payload = ticket.getPayload();

      if (!payload?.sub) {
        throw new UnauthorizedException('Invalid Google token payload');
      }

      // Require verified email when present
      if (payload.email_verified === false) {
        throw new UnauthorizedException('Google email not verified');
      }

      return {
        sub: payload.sub,
        email: payload.email ?? `google_${payload.sub}`,
        email_verified: payload.email_verified ?? true,
        name: payload.name ?? '',
        given_name: payload.given_name ?? '',
        family_name: payload.family_name ?? '',
        picture: payload.picture ?? '',
        locale: payload.locale ?? '',
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      const message = error instanceof Error ? error.message : String(error);
      console.error('Google token verification error:', message);

      // Surface common causes for easier debugging
      if (message.includes('audience') || message.includes('aud')) {
        throw new UnauthorizedException(
          'Invalid Google token: audience mismatch. Set GOOGLE_CLIENT_ID on the backend to the same value as NEXT_PUBLIC_GOOGLE_CLIENT_ID on the frontend.',
        );
      }
      throw new UnauthorizedException('Invalid Google token');
    }
  }

  async verifyAccessToken(accessToken: string): Promise<GoogleUserInfo> {
    try {
      // Verify the access token by calling Google's userinfo endpoint
      const response = await this.client.getTokenInfo(accessToken);

      if (!response.email) {
        throw new UnauthorizedException(
          'Invalid access token - no email found',
        );
      }

      // Get additional user info using the access token
      const userInfoResponse = await fetch(
        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`,
      );

      if (!userInfoResponse.ok) {
        throw new UnauthorizedException(
          'Failed to fetch user info from Google',
        );
      }

      const userInfo = await userInfoResponse.json();

      return {
        sub: userInfo.id,
        email: userInfo.email,
        email_verified: userInfo.verified_email,
        name: userInfo.name,
        given_name: userInfo.given_name,
        family_name: userInfo.family_name,
        picture: userInfo.picture,
        locale: userInfo.locale,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      console.error('Google access token verification error:', error);
      throw new UnauthorizedException('Invalid Google access token');
    }
  }

  async verifyToken(
    token: string,
    tokenType: 'id_token' | 'access_token' = 'id_token',
  ): Promise<GoogleUserInfo> {
    if (tokenType === 'id_token') {
      return this.verifyIdToken(token);
    } else {
      return this.verifyAccessToken(token);
    }
  }
}
