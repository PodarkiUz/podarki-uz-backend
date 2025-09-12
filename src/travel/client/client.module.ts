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
import { TelegramGatewayService } from './service/telegram-gateway.service';
import { TelegramGatewayOtpRepo } from './repo/telegram-gateway-otp.repo';
import { BlogController } from './controller/blog.controller';
import { BlogService } from './service/blog.service';
@Module({
  imports: [AuthModule, SharedModule],
  controllers: [TourController, OrganizerController, DestinationController, TelegramAuthController, BlogController],
  providers: [TourService, OrganizerService, DestinationService, TelegramAuthService, TelegramBotService, TelegramGatewayService, TelegramGatewayOtpRepo, BlogService],
})
export class ClientModule {}
