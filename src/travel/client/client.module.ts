import { Module } from '@nestjs/common';
import { TourController } from './controller/tour.controller';
import { TourService } from './service/tour.service';
import { SharedModule } from '../shared/shared.module';
import { OrganizerController } from './controller/organizer.controller';
import { OrganizerService } from './service/organizer.service';
import { DestinationController } from './controller/destination.controller';
import { DestinationService } from './service/destination.service';
import { AuthModule } from '../core/auth/auth.module';
import { TelegramAuthController } from './controller/telegram-auth.controller';
import { TelegramAuthService } from './service/telegram-auth.service';
import { TelegramBotService } from './service/telegram-bot.service';
import { TelegramOtpRepo } from './repo/telegram-otp.repo';
@Module({
  imports: [AuthModule, SharedModule],
  controllers: [TourController, OrganizerController, DestinationController, TelegramAuthController],
  providers: [TourService, OrganizerService, DestinationService, TelegramAuthService, TelegramBotService, TelegramOtpRepo],
})
export class ClientModule {}
