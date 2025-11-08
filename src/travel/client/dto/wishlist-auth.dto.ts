import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class WishlistSignUpDto {
  @ApiProperty({ description: 'Unique login for wishlist user' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  login: string;

  @ApiProperty({ description: 'Password for wishlist user' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(64)
  password: string;
}

export class WishlistSignInDto {
  @ApiProperty({ description: 'User login' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  login: string;

  @ApiProperty({ description: 'User password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(64)
  password: string;
}
