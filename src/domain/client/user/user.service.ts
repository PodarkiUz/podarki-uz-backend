import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { UserRepo } from './user.repo';
import { UserRoles, UserStatus } from './enum/user.enum';
import { IUser } from './interface/user.interface';
import { EmailConfirmationService } from './email-confirmaton.service';
import { EmailAlreadyRegistered } from 'src/errors/permission.error';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly emailService: EmailConfirmationService,
  ) {}

  async signUp(params: CreateUserDto) {
    return this.userRepo.knex
      .transaction(async () => {
        const hasPhone: IUser = await this.userRepo.selectByPhone(params.phone);

        if (hasPhone) {
          throw new EmailAlreadyRegistered();
        }

        const otp = Math.floor(10000 + Math.random() * 90000);

        const [user]: [IUser] = await this.userRepo.insert({
          phone: params.phone,
          first_name: params.first_name,
          last_name: params.last_name,
          otp: otp,
          status: UserStatus.REGISTERED,
        });

        // await this.emailService.sendVerificationLink(params.email, otp);

        return { otp: user.otp, phone: user.phone };
      })
      .then((data) => {
        return data;
      });
  }
}
