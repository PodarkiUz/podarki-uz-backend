import { Module } from '@nestjs/common';
import { AuthModule } from '@core/auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { ClientModule } from './client/client.module';

@Module({
  imports: [AuthModule, AdminModule, ClientModule],
})
export class TravelModule { }
