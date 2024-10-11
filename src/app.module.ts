import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileRouterModule } from './core/file-router/file-router.module';
import { KnexModule } from 'nestjs-knex';
import config from '../knexfile';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@auth/auth.module';
import { AdminModule } from '@domain/admin/admin.module';

console.log(config);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['/app/.env', '.env'],
      isGlobal: true,
    }),
    KnexModule.forRoot({ config }),
    FileRouterModule,
    AuthModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
