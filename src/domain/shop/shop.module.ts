import { Module } from '@nestjs/common';
import { AuthModule } from '@core/auth/auth.module';
import { ShopController } from './controller/shop.controller';
import { ShopService } from './service/shop.service';
import { ShopRepo } from './repo/shop.repo';

@Module({
  imports: [AuthModule],
  controllers: [ShopController],
  providers: [ShopService, ShopRepo],
})
export class ShopModule {}
