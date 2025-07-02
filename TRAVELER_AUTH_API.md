# Traveler Authentication API

This document describes the comprehensive CRUD API for travelers with phone number and Google authentication.

## Overview

The Traveler Authentication API provides a complete authentication system for travelers with the following features:

- **Phone Number Authentication**: OTP-based verification
- **Google OAuth**: Integration with Google authentication
- **JWT Token Management**: Access and refresh tokens
- **Profile Management**: CRUD operations for traveler profiles
- **Session Management**: Secure session handling

## Base URL

```
/api/traveler/auth
```

## Authentication

Most endpoints require authentication using JWT Bearer tokens:

```
Authorization: Bearer <access_token>
```

## Endpoints

### 1. Phone Verification

#### Send Verification Code
```http
POST /api/traveler/auth/send-verification
```

**Request Body:**
```json
{
  "phone_number": "+998901234567"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Verification code sent to +998901234567"
}
```

#### Verify Phone OTP
```http
POST /api/traveler/auth/verify-phone
```

**Request Body:**
```json
{
  "phone_number": "+998901234567",
  "otp_code": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Phone number verified successfully"
}
```

### 2. Authentication

#### Sign Up
```http
POST /api/traveler/auth/signup
```

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "phone_number": "+998901234567",
  "date_of_birth": "1990-01-01",
  "gender": "male",
  "nationality": "Uzbek",
  "passport_number": "AA1234567",
  "home_country": "Uzbekistan",
  "home_city": "Tashkent"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "success": true
}
```

#### Sign In
```http
POST /api/traveler/auth/signin
```

**Request Body (Phone):**
```json
{
  "provider": "phone",
  "phone_number": "+998901234567"
}
```

**Request Body (Google):**
```json
{
  "provider": "google",
  "google_token": "google_id_token_or_access_token",
  "google_token_type": "id_token"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "success": true
}
```

#### Google Authentication
```http
POST /api/traveler/auth/google
```

**Request Body:**
```json
{
  "token": "google_id_token_or_access_token",
  "token_type": "id_token"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "success": true
}
```

### 3. Token Management

#### Refresh Token
```http
POST /api/traveler/auth/refresh
```

**Request Body:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "success": true
}
```

#### Logout
```http
POST /api/traveler/auth/logout
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### 4. Profile Management

#### Get Profile
```http
GET /api/traveler/auth/profile
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "id": "traveler_id",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "phone_number": "+998901234567",
  "date_of_birth": "1990-01-01",
  "gender": "male",
  "nationality": "Uzbek",
  "passport_number": "AA1234567",
  "avatar_url": "https://example.com/avatar.jpg",
  "home_country": "Uzbekistan",
  "home_city": "Tashkent",
  "is_phone_verified": true,
  "is_email_verified": true,
  "is_active": true,
  "preferred_language": "uz",
  "timezone": "Asia/Tashkent",
  "last_login_at": "2024-01-01T12:00:00Z",
  "created_at": "2024-01-01T10:00:00Z",
  "updated_at": "2024-01-01T12:00:00Z"
}
```

#### Update Profile
```http
PUT /api/traveler/auth/profile
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Smith",
  "email": "john.smith@example.com",
  "nationality": "American"
}
```

**Response:** Same as Get Profile

### 5. Admin Management (Protected)

#### Get All Travelers
```http
GET /api/travelers?limit=50&offset=0&search=john
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `limit` (optional): Number of records to return (default: 50)
- `offset` (optional): Number of records to skip (default: 0)
- `search` (optional): Search term for name, email, or phone

**Response:**
```json
[
  {
    "id": "traveler_id_1",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "phone_number": "+998901234567",
    "is_active": true,
    "created_at": "2024-01-01T10:00:00Z"
  }
]
```

#### Get Traveler by ID
```http
GET /api/travelers/{id}
Authorization: Bearer <access_token>
```

**Response:** Same as Get Profile

#### Activate Traveler
```http
POST /api/travelers/{id}/activate
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "id": "traveler_id",
  "is_active": true,
  "updated_at": "2024-01-01T12:00:00Z"
}
```

#### Deactivate Traveler
```http
POST /api/travelers/{id}/deactivate
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "id": "traveler_id",
  "is_active": false,
  "updated_at": "2024-01-01T12:00:00Z"
}
```

#### Delete Traveler
```http
DELETE /api/travelers/{id}
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "id": "traveler_id",
  "is_deleted": true,
  "updated_at": "2024-01-01T12:00:00Z"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Invalid verification code",
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Invalid access token",
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Traveler not found",
  "error": "Not Found"
}
```

## Database Schema

### travelers table
```sql
CREATE TABLE travelers (
  id VARCHAR(24) PRIMARY KEY DEFAULT generate_object_id(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE,
  
  -- Basic user information
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  email VARCHAR(255),
  phone_number VARCHAR(20) UNIQUE NOT NULL,
  
  -- Authentication fields
  password_hash VARCHAR(255),
  google_id VARCHAR(255),
  google_email VARCHAR(255),
  
  -- Profile information
  avatar_url TEXT,
  date_of_birth DATE,
  gender ENUM('male', 'female', 'other'),
  nationality VARCHAR(100),
  passport_number VARCHAR(50),
  
  -- Verification and status
  is_phone_verified BOOLEAN DEFAULT FALSE,
  is_email_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMP,
  
  -- Preferences
  preferred_language VARCHAR(10) DEFAULT 'uz',
  timezone VARCHAR(50) DEFAULT 'Asia/Tashkent',
  
  -- Location
  current_location VARCHAR(255),
  home_country VARCHAR(100),
  home_city VARCHAR(100)
);
```

### phone_verification_codes table
```sql
CREATE TABLE phone_verification_codes (
  id VARCHAR(24) PRIMARY KEY DEFAULT generate_object_id(),
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE,
  
  phone_number VARCHAR(20) NOT NULL,
  code VARCHAR(6) NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  attempts INTEGER DEFAULT 0
);
```

### traveler_sessions table
```sql
CREATE TABLE traveler_sessions (
  id VARCHAR(24) PRIMARY KEY DEFAULT generate_object_id(),
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE,
  
  traveler_id VARCHAR(24) REFERENCES travelers(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  device_info JSONB,
  ip_address VARCHAR(45)
);
```

## Environment Variables

```env
# JWT Configuration
JWT_SECRET=your_jwt_secret_here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=your_google_redirect_uri
```

## Security Features

1. **JWT Token Security**: Access tokens expire in 23 hours, refresh tokens in 14 days
2. **OTP Security**: 6-digit codes expire in 10 minutes, max 3 attempts
3. **Session Management**: Secure session storage with device info and IP tracking
4. **Input Validation**: Comprehensive validation using class-validator
5. **SQL Injection Protection**: Parameterized queries using Knex.js
6. **Password Hashing**: bcrypt with salt rounds of 10

## Rate Limiting

Consider implementing rate limiting for:
- OTP sending (max 3 requests per phone number per hour)
- Login attempts (max 5 attempts per IP per 15 minutes)
- API endpoints (general rate limiting)

## SMS Integration

The OTP sending functionality needs to be integrated with an SMS service. Currently, it logs the OTP to console for development purposes.

## Google OAuth Setup

1. Create a Google Cloud Project
2. Enable Google+ API
3. Create OAuth 2.0 credentials
4. Set authorized redirect URIs
5. Configure environment variables

## Testing

Use the following test data:

**Phone Number:** +998901234567
**OTP Code:** 123456 (for development)
**Google Token:** Use Google's test tokens or real Google authentication

## Migration

Run the migration to create the required tables:

```bash
npm run migration:run
```

This will create the travelers, phone_verification_codes, and traveler_sessions tables. 