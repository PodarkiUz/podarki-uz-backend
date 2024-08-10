import { Injectable } from '@nestjs/common';
import { ConfirmOtpDto, UserLoginDto } from './dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserRepo } from './user.repo';
import {
  IncorrectOtpException,
  UserNotFoundException,
} from 'src/errors/permission.error';
import { IUser } from './interface/user.interface';
import { EmailConfirmationService } from './email-confirmaton.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepo: UserRepo,
    private readonly emailService: EmailConfirmationService,
  ) {}

  async confirmOtp(params: ConfirmOtpDto) {
    const user: IUser = await this.userRepo.selectByPhone(params.phone);

    if (!user) {
      throw new UserNotFoundException();
    }

    if (user.otp !== params.otp) {
      throw new IncorrectOtpException();
    }

    await this.userRepo.updateById(user.id, { otp: null });

    return {
      access_token: await this.jwtService.signAsync(
        { id: user.id },
        { privateKey: 'podarkiuz-app' },
      ),
    };
  }

  async login(params: UserLoginDto) {
    const user: IUser = await this.userRepo.selectByPhone(params.phone);

    if (!user) {
      throw new UserNotFoundException();
    }

    const otp = Math.floor(10000 + Math.random() * 90000);

    await this.userRepo.updateById(user.id, {
      otp: otp,
    });

    // await this.emailService.sendVerificationLink(params.email, otp);

    return { otp: user.otp, phone: user.phone };
  }
}
