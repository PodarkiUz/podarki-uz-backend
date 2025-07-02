import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileRouterModule } from './travel/core/file-router/file-router.module';
import { KnexModule } from 'nestjs-knex';
import config from '../knexfile';
import { ConfigModule } from '@nestjs/config';
import { TravelModule } from './travel/travel.module';
import { AuthModule } from './travel/core/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['/app/.env', '.env'],
      isGlobal: true,
    }),
    KnexModule.forRoot({ config }),
    FileRouterModule,
    AuthModule,

    TravelModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
