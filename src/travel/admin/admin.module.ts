import { Module } from '@nestjs/common';
import { OrganizerController } from './controller/organizer.controller';
import { OrganizerService } from './service/organizer.service';
import { OrganizerRepo } from '../shared/repo/organizer.repo';
import { FilesRepo } from '../shared/repo/files.repo';
import { AuthModule } from '../core/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [OrganizerController],
  providers: [OrganizerService, OrganizerRepo, FilesRepo],
})
export class AdminModule { }
