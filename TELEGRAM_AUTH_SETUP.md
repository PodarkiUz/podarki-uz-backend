# Telegram Authentication Setup

This guide explains how to set up and use Telegram authentication in the travel application.

## Prerequisites

1. Create a Telegram Bot using [@BotFather](https://t.me/botfather)
2. Get your bot token
3. Set up Telegram Login Widget

## Environment Variables

Add the following environment variable to your `.env` file:

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
```

## Database Migration

Run the migration to add Telegram authentication fields:

```bash
npm run migrate:latest
```

## Frontend Integration

### 1. Username-based OTP Authentication

For a more secure approach, you can implement username-based OTP authentication:

```javascript
// Step 1: Send OTP to Telegram username
async function sendTelegramOtp(username) {
  try {
    const response = await fetch('/client/telegram-auth/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('OTP sent to Telegram:', result.message);
      // Show OTP input field to user
    }
  } catch (error) {
    console.error('Failed to send OTP:', error);
  }
}

// Step 2: Verify OTP
async function verifyTelegramOtp(username, otpCode) {
  try {
    const response = await fetch('/client/telegram-auth/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, otp_code: otpCode }),
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('OTP verified successfully');
      // Proceed with authentication or registration
    }
  } catch (error) {
    console.error('Failed to verify OTP:', error);
  }
}
```

### 2. Add Telegram Login Widget

Include the Telegram Login Widget script in your HTML:

```html
<script async src="https://telegram.org/js/telegram-widget.js?22" 
        data-telegram-login="YourBotName" 
        data-size="large" 
        data-auth-url="https://your-domain.com/auth/telegram/callback"
        data-request-access="write">
</script>
```

### 2. Handle Authentication Callback

When a user clicks the Telegram Login Widget, it will redirect to your callback URL with authentication data. Send this data to your API:

```javascript
// Example frontend code
async function handleTelegramAuth(authData) {
  try {
    const response = await fetch('/client/telegram-auth/authenticate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(authData),
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Store tokens
      localStorage.setItem('accessToken', result.accessToken);
      localStorage.setItem('refreshToken', result.refreshToken);
      
      // Redirect or update UI
      console.log('Authentication successful:', result.user);
    }
  } catch (error) {
    console.error('Authentication failed:', error);
  }
}
```

## API Endpoints

### 1. Send OTP to Telegram Username
```
POST /client/telegram-auth/send-otp
```

**Request Body:**
```json
{
  "username": "johndoe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Verification code sent to @johndoe via Telegram"
}
```

### 2. Verify Telegram OTP
```
POST /client/telegram-auth/verify-otp
```

**Request Body:**
```json
{
  "username": "johndoe",
  "otp_code": "12345"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Telegram username verified successfully"
}
```

### 3. Authenticate with Telegram
```
POST /client/telegram-auth/authenticate
```

**Request Body:**
```json
{
  "id": 123456789,
  "first_name": "John",
  "last_name": "Doe",
  "username": "johndoe",
  "photo_url": "https://t.me/i/userpic/320/johndoe.jpg",
  "auth_date": 1640995200,
  "hash": "abc123..."
}
```

**Response:**
```json
{
  "accessToken": "jwt_token_here",
  "refreshToken": "refresh_token_here",
  "success": true,
  "user": {
    "id": "user_id",
    "telegram_id": 123456789,
    "username": "johndoe",
    "first_name": "John",
    "last_name": "Doe",
    "photo_url": "https://t.me/i/userpic/320/johndoe.jpg",
    "email": null,
    "phone_number": null,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### 4. Get User Profile
```
GET /client/telegram-auth/profile
Authorization: Bearer <access_token>
```

### 5. Update User Profile
```
PUT /client/telegram-auth/profile
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "phone_number": "+998901234567",
  "date_of_birth": "1990-01-01",
  "gender": "male",
  "nationality": "Uzbek",
  "passport_number": "AA1234567",
  "home_country": "Uzbekistan",
  "home_city": "Tashkent"
}
```

### 6. Refresh Token
```
POST /client/telegram-auth/refresh
```

**Request Body:**
```json
{
  "refresh_token": "refresh_token_here"
}
```

## Security Features

1. **OTP Verification**: Send verification codes directly to user's Telegram account
2. **Hash Verification**: The API verifies the Telegram authentication hash to ensure data integrity
3. **JWT Tokens**: Secure access and refresh tokens for session management
4. **User Isolation**: Each user has a unique Telegram ID and cannot impersonate others
5. **Rate Limiting**: OTP codes expire after 10 minutes and have attempt limits

## Testing

You can test the Telegram OTP authentication using the following curl commands:

```bash
# 1. Send OTP to Telegram username
curl -X POST http://localhost:3000/client/telegram-auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser"
  }'

# 2. Verify OTP (use the code received via Telegram)
curl -X POST http://localhost:3000/client/telegram-auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "otp_code": "12345"
  }'
```

## Troubleshooting

1. **Invalid hash error**: Make sure your bot token is correctly set in environment variables
2. **User not found**: Check if the user exists in the database
3. **Token expired**: Use the refresh token endpoint to get a new access token

## Notes

- The `telegram_id` field is unique to prevent duplicate accounts
- Users can update their profile information after authentication
- The system supports multiple authentication providers (phone, Google, Telegram)
- All authentication data is verified server-side for security
