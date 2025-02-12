import { Module } from '@nestjs/common';
import { AuthModule } from '@core/auth/auth.module';
import { TourController } from './controller/tour.controller';
import { TourService } from './service/tour.service';
import { SharedModule } from '../shared/shared.module';
import { OrganizerController } from './controller/organizer.controller';
import { OrganizerService } from './service/organizer.service';

@Module({
  imports: [AuthModule, SharedModule],
  controllers: [TourController, OrganizerController],
  providers: [TourService, OrganizerService],
})
export class ClientModule {}
