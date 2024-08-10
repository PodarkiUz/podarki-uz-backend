import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './domain/client/user/user.module';
import { ProductModule } from './domain/client/product/product.module';
import { AdminModule } from './domain/admin/admin.module';
import { PoolService } from './providers/pool.service';
import { FileRouterModule } from './domain/file-router/file-router.module';
import { CabinetModule } from './domain/cabinet/cabinet.module';
import { CategoryModule } from './domain/client/category/category.module';
import { OrdersModule } from './domain/client/orders/orders.module';

@Module({
  imports: [
    CategoryModule,
    UserModule,
    ProductModule,
    AdminModule,
    FileRouterModule,
    OrdersModule,
    CabinetModule,
  ],
  controllers: [AppController],
  providers: [AppService, PoolService],
})
export class AppModule {}
