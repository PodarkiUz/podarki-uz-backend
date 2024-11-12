import { Module } from '@nestjs/common';
import { UserHolidaysController } from './controller/user-holidays.controller';
import { UserHolidaysService } from './service/user-holidays.service';
import { UserHolidaysRepo } from './repo/user-holidays.repo';
import { AuthModule } from '@core/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UserHolidaysController],
  providers: [UserHolidaysService, UserHolidaysRepo],
})
export class ClientModule {}
