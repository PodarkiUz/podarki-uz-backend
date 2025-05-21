import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TourRepo } from './repo/tour.repo';
import { OrganizerRepo } from './repo/organizer.repo';
import { FilesRepo } from './repo/files.repo';
import { CityRepo } from './repo/cities.repo';
import { DestinationRepo } from './repo/destination.repo';
import { LocationRepo } from './repo/locations.repo';

const repos = [
  TourRepo,
  OrganizerRepo,
  FilesRepo,
  CityRepo,
  DestinationRepo,
  LocationRepo,
];

const modules = [
  HttpModule.register({
    maxRedirects: 5,
  }),
];

const providers = [];

@Module({
  imports: [...modules],
  providers: [...repos, ...providers],
  exports: [...modules, ...repos, ...providers],
})
export class SharedModule {}
