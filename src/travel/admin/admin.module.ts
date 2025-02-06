import { Module } from '@nestjs/common';
import { OrganizerController } from './controller/organizer.controller';
import { OrganizerService } from './service/organizer.service';
import { OrganizerRepo } from '../shared/repo/organizer.repo';
import { AuthModule } from '../core/auth/auth.module';
import { FilesRepo } from '../shared/repo/files.repo';
import { TourController } from './controller/tour.controller';
import { TourService } from './service/tour.service';
import { TourRepo } from '../shared/repo/tour.repo';
import { CityRepo } from '../shared/repo/cities.repo';

@Module({
  imports: [AuthModule],
  controllers: [OrganizerController, TourController],
  providers: [
    OrganizerService,
    OrganizerRepo,
    FilesRepo,
    TourService,
    TourRepo,
    CityRepo,
  ],
})
export class AdminModule {}
