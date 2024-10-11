import { ApiProperty } from '@nestjs/swagger';

export class TokenResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  accessToken: string;

  @ApiProperty({ description: 'JWT refresh token' })
  refreshToken: string;
}
export class LoginResponseDto {
  @ApiProperty({ description: 'Boolean indicating success' })
  ok: boolean;

  @ApiProperty({
    description: 'Response object containing access and refresh tokens',
    type: () => TokenResponseDto,
  })
  response: TokenResponseDto;
}

export class MeResponseDto {
  @ApiProperty({ description: 'Boolean indicating success' })
  ok: boolean;

  @ApiProperty({
    description: 'Response object containing user data',
    type: () => MeUserResponseDto,
  })
  response: Response;
}

export class MeUserResponseDto {
  @ApiProperty({ description: 'User id' })
  id: string;

  @ApiProperty({ description: 'User username' })
  username: string;

  @ApiProperty({ description: 'User is active' })
  is_active: boolean;

  @ApiProperty({ description: 'User first name' })
  first_name: string;

  @ApiProperty({ description: 'User last name' })
  last_name: string;

  @ApiProperty({ description: 'User middle name' })
  middle_name: string;

  @ApiProperty({ description: 'User is verified' })
  is_verified: boolean;

  @ApiProperty({ description: 'User roles' })
  roles: string[];

  @ApiProperty({ description: 'User permissions' })
  permissions: any;

  @ApiProperty({ description: 'User providers' })
  providers: any;
}

export class ErrorResponseDto {
  @ApiProperty({ description: 'Boolean indicating success' })
  ok: boolean;

  @ApiProperty({
    description: 'error object containing error message',
    type: () => Error,
  })
  error: Error;
}
