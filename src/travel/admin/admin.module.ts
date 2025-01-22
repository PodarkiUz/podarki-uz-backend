import { Module } from '@nestjs/common';
import { AuthModule } from '@core/auth/auth.module';
import { OrganizerController } from './controller/organizer.controller';
import { OrganizerService } from './service/organizer.service';
import { OrganizerRepo } from './repo/organizer.repo';

@Module({
  imports: [AuthModule],
  controllers: [OrganizerController],
  providers: [OrganizerService, OrganizerRepo],
})
export class OrganizerModule { }
