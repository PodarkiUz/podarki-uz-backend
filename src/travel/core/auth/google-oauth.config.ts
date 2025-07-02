import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleOAuthConfig {
  get clientId(): string {
    return process.env.GOOGLE_CLIENT_ID || '';
  }

  get clientSecret(): string {
    return process.env.GOOGLE_CLIENT_SECRET || '';
  }

  get redirectUri(): string {
    return process.env.GOOGLE_REDIRECT_URI || '';
  }
}

// Environment variables needed:
// GOOGLE_CLIENT_ID=your_google_oauth_client_id
// GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret (optional for ID token verification) 