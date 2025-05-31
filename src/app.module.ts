import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
    AuthModule,

    TravelModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
