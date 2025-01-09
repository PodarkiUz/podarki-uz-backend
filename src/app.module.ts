import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileRouterModule } from './core/file-router/file-router.module';
import { KnexModule } from 'nestjs-knex';
import config from '../knexfile';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@auth/auth.module';
import { AdminModule } from '@domain/admin/admin.module';
import { ClientModule } from '@domain/client/client.module';
import { ShopModule } from '@domain/shop/shop.module';

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
    ClientModule,
    ShopModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
