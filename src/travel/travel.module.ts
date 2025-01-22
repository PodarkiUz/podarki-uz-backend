import { Module } from '@nestjs/common';
import { AuthModule } from '@core/auth/auth.module';
import { OrganizerModule } from './admin/admin.module';
import { TourModule } from './tour/admin.module';

@Module({
  imports: [AuthModule, OrganizerModule, TourModule],
})
export class TravelModule { }
