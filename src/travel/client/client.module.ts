import { Module } from '@nestjs/common';
import { AuthModule } from '@core/auth/auth.module';
import { TourController } from './controller/tour.controller';
import { TourService } from './service/tour.service';
import { SharedModule } from '../shared/shared.module';
import { OrganizerController } from './controller/organizer.controller';
import { OrganizerService } from './service/organizer.service';
import { DestinationController } from './controller/destination.controller';
import { DestinationService } from './service/destination.service';
@Module({
  imports: [AuthModule, SharedModule],
  controllers: [TourController, OrganizerController, DestinationController],
  providers: [TourService, OrganizerService, DestinationService],
})
export class ClientModule {}
