import { Module } from '@nestjs/common';
import { AuthModule } from '@core/auth/auth.module';
import { TourController } from './controller/tour.controller';
import { TourService } from './service/tour.service';
import { TourRepo } from './repo/tour.repo';
import { CityRepo } from './repo/cities.repo';

@Module({
  imports: [AuthModule],
  controllers: [TourController],
  providers: [TourRepo, TourService, CityRepo],
})
export class TourModule { }
