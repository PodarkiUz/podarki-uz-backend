import { Module } from '@nestjs/common';
import { AuthModule } from '@core/auth/auth.module';
import { TourController } from './controller/tour.controller';
import { TourService } from './service/tour.service';
import { CityRepo } from '../shared/repo/cities.repo';
import { TourRepo } from '../shared/repo/tour.repo';

@Module({
  imports: [AuthModule],
  controllers: [TourController],
  providers: [TourRepo, TourService, CityRepo],
})
export class TourModule { }
