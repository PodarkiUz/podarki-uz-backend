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
import { DestinationController } from './controller/destination.controller';
import { DestinationService } from './service/destination.service';
import { DestinationRepo } from '../shared/repo/destination.repo';
import { InstagramController } from './controller/instagram.controller';
import { InstagramService } from './service/instagram.service';
import { OpenAIService } from './service/openai.service';
import { InstagramPostsRepo } from '../shared/repo/instagram-posts.repo';

@Module({
  imports: [AuthModule],
  controllers: [
    OrganizerController,
    TourController,
    DestinationController,
    InstagramController,
  ],
  providers: [
    OrganizerService,
    OrganizerRepo,
    FilesRepo,
    TourService,
    TourRepo,
    CityRepo,
    DestinationService,
    DestinationRepo,
    InstagramService,
    OpenAIService,
    InstagramPostsRepo,
  ],
})
export class AdminModule {}
