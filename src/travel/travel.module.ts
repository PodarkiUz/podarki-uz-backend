import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { ClientModule } from './client/client.module';
import { AuthModule } from './core/auth/auth.module';

@Module({
  imports: [AuthModule, AdminModule, ClientModule],
})
export class TravelModule {}
