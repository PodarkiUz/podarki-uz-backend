import { Module } from '@nestjs/common';
import { AuthModule } from '@core/auth/auth.module';
import { TourController } from './controller/tour.controller';
import { TourService } from './service/tour.service';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [AuthModule, SharedModule],
  controllers: [TourController],
  providers: [TourService],
})
export class ClientModule {}
