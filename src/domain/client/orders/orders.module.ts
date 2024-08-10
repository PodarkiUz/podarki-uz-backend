import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrdersRepo } from './orders.repo';
import { JwtService } from '@nestjs/jwt';
import { ProductRepo } from '../product/product.repo';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  // controllers: [OrdersController],
  providers: [OrdersService, OrdersRepo, ProductRepo, JwtService],
})
export class OrdersModule {}
