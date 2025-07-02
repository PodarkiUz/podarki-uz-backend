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

  async verifyIdToken(idToken: string): Promise<GoogleUserInfo> {
    try {
      // Verify the ID token
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID, // Must match your client ID
      });

      const payload = ticket.getPayload();

      if (!payload) {
        throw new UnauthorizedException('Invalid Google token payload');
      }

      // Check if email is verified
      if (!payload.email_verified) {
        throw new UnauthorizedException('Google email not verified');
      }

      return {
        sub: payload.sub,
        email: payload.email!,
        email_verified: payload.email_verified!,
        name: payload.name!,
        given_name: payload.given_name!,
        family_name: payload.family_name!,
        picture: payload.picture!,
        locale: payload.locale!,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      console.error('Google token verification error:', error);
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
