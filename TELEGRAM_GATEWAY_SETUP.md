# Telegram Gateway API Setup Guide

This guide explains how to set up and use Telegram's official verification codes bot through the Gateway API for sending OTPs.

## Overview

The Telegram Gateway API allows you to send verification codes through Telegram's official @VerificationCodes bot, providing a more secure and cost-effective alternative to SMS-based OTPs.

## Prerequisites

1. A Telegram account
2. A business/application that needs OTP verification
3. Access to the Telegram Gateway platform

## Setup Steps

### 1. Create Telegram Gateway Account

1. Navigate to [Telegram Gateway Platform](https://core.telegram.org/gateway/verification-tutorial)
2. Log in using your Telegram account
3. Provide your business information as prompted
4. Complete the account setup process

### 2. Fund Your Account

1. Go to the funding section in your Gateway account
2. Add funds through Fragment (Telegram's payment system)
3. Ensure you have sufficient balance for sending verification codes

### 3. Generate API Token

1. In your Gateway account settings, generate an API token
2. Keep this token secure - it's required for all API requests
3. Add the token to your environment variables

### 4. Environment Configuration

Add the following environment variable to your `.env` file:

```env
TELEGRAM_GATEWAY_API_TOKEN=your_gateway_api_token_here
```

### 5. Database Migration

Run the migration to create the required table:

```bash
npm run migrate:latest
```

This will create the `telegram_gateway_otp` table to store request IDs and verification data.

## API Endpoints

### 1. Send OTP via Gateway API

```
POST /client/telegram-auth/send-gateway-otp
```

**Request Body:**
```json
{
  "phoneNumber": "+998901234567"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Verification code sent to +998901234567 via Telegram",
  "requestId": "gateway_request_id_here"
}
```

### 2. Verify OTP via Gateway API

```
POST /client/telegram-auth/verify-gateway-otp
```

**Request Body:**
```json
{
  "phoneNumber": "+998901234567",
  "otp_code": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Phone number verified successfully",
  "user": {
    "id": "user_id",
    "phone_number": "+998901234567",
    "auth_provider": "telegram_gateway",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  "isNewUser": true
}
```

## Phone Number Formats

The system supports various phone number formats:

- **International format**: `+998901234567`
- **Without +**: `998901234567`
- **Local format**: `901234567` (assumes Uzbekistan +998)

## Features

### Security Features

1. **Official Telegram Delivery**: Codes are sent through Telegram's official @VerificationCodes bot
2. **Phone Number Validation**: Automatic formatting and validation of phone numbers
3. **Rate Limiting**: Maximum 3 attempts per verification code
4. **Expiration**: Codes expire after 10 minutes
5. **One-time Use**: Each code can only be used once

### Cost Benefits

- **Cheaper than SMS**: Significantly lower cost per message
- **Global Reach**: Works anywhere with internet access
- **No Carrier Dependencies**: Not limited by local SMS providers

## Testing

Use the provided test file `test-telegram-gateway-auth.http` to test the implementation:

```bash
# Test sending OTP
curl -X POST http://localhost:3000/client/telegram-auth/send-gateway-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+998901234567"}'

# Test verifying OTP
curl -X POST http://localhost:3000/client/telegram-auth/verify-gateway-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+998901234567", "otp_code": "123456"}'
```

## Implementation Details

### Services

1. **TelegramGatewayService**: Handles API communication with Telegram Gateway
2. **TelegramGatewayOtpRepo**: Manages database operations for OTP requests
3. **TelegramAuthService**: Updated to support both bot-based and Gateway API authentication

### Database Schema

The `telegram_gateway_otp` table stores:
- `phone_number`: User's phone number
- `request_id`: Gateway API request ID
- `expires_at`: Code expiration time
- `is_used`: Whether the code has been used
- `attempts`: Number of verification attempts

## Migration from Bot-based OTP

If you're currently using the bot-based OTP system, you can:

1. **Keep both systems**: Use bot-based for username authentication and Gateway API for phone-based authentication
2. **Migrate completely**: Replace bot-based system with Gateway API
3. **Hybrid approach**: Use Gateway API as primary method with bot-based as fallback

## Troubleshooting

### Common Issues

1. **Invalid phone number format**: Ensure phone numbers are in valid E.164 format
2. **API token not configured**: Check that `TELEGRAM_GATEWAY_API_TOKEN` is set in environment variables
3. **Insufficient funds**: Ensure your Gateway account has sufficient balance
4. **Code expired**: Codes expire after 10 minutes - request a new one

### Error Messages

- `Invalid phone number format`: Phone number doesn't match expected format
- `No verification request found`: No active OTP request for the phone number
- `Verification code already used`: The code has already been used
- `Verification code expired`: The code has expired (10+ minutes old)
- `Too many attempts`: More than 3 failed verification attempts

## Security Considerations

1. **API Token Security**: Keep your Gateway API token secure and never expose it in client-side code
2. **Rate Limiting**: Implement additional rate limiting on your application level
3. **Phone Number Privacy**: Ensure phone numbers are handled securely and in compliance with privacy regulations
4. **Audit Logging**: Consider logging verification attempts for security monitoring

## Benefits Over Bot-based OTP

1. **No Bot Maintenance**: No need to maintain a Telegram bot
2. **Better User Experience**: Users don't need to start a bot
3. **Official Delivery**: More trustworthy for users
4. **Phone-based**: Works with phone numbers instead of usernames
5. **Cost Effective**: Cheaper than SMS and bot maintenance

## Next Steps

1. Set up your Telegram Gateway account
2. Configure environment variables
3. Run database migrations
4. Test the implementation
5. Deploy to production

For more information, refer to the [Telegram Gateway API Documentation](https://core.telegram.org/gateway/verification-tutorial).
