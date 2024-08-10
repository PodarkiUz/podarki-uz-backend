import { Module } from '@nestjs/common';
import { AdminProductService } from './service/product.service';
import { AdminCategoryController } from './controller/category.controller';
import { AdminProductController } from './controller/product.controller';
import { AdminCategoryService } from './service/category.service';
import { AdminCategoryRepo, AdminSubcategoryRepo } from './repo/category.repo';
import { AdminProductRepo } from './repo/product.repo';
import { UserModule } from '../client/user/user.module';
import { JwtService } from '@nestjs/jwt';
import { ProductModule } from '../client/product/product.module';
import { AdminUserService } from './service/user.service';
import { AdminUserRepo } from './repo/user.repo';
import { AdminUserController } from './controller/user.controller';
import { AdminAdvertisementController } from './controller/ads.controller';
import { AdminAdvertisementService } from './service/ads.service';
import { AdminAdvertisementRepo } from './repo/ads.repo';
import { SuperAdminController } from './controller/super-admin.controller';
import { AdminShopController } from './controller/shop.controller';
import { AdminShopService } from './service/shop.service';
import { AdminShopRepo } from './repo/shop.repo';
import { OrdersRepo } from '../client/orders/orders.repo';

@Module({
  imports: [UserModule, ProductModule],
  controllers: [
    SuperAdminController,
    AdminCategoryController,
    AdminProductController,
    // AdminUserController,
    // AdminAdvertisementController,
    AdminShopController,
  ],
  providers: [
    AdminCategoryService,
    AdminProductService,
    AdminCategoryRepo,
    AdminSubcategoryRepo,
    AdminProductRepo,
    AdminUserService,
    AdminUserRepo,
    JwtService,
    OrdersRepo,
    AdminAdvertisementService,
    AdminAdvertisementRepo,

    AdminShopService,
    AdminShopRepo,
  ],
})
export class AdminModule {}
