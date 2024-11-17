import { Module } from '@nestjs/common';
import { CategoryController } from './controller/category.controller';
import { CategoryService } from './service/category.service';
import { CategoryRepo } from './repo/category.repo';
import { CategoryGroupService } from './service/category-group.service';
import { CategoryGroupRepo } from './repo/category-group.repo';
import { CategoryGroupController } from './controller/category-group.controller';
import { FiltersController } from './controller/filters.controller';
import { FiltersService } from './service/filters.service';
import { IdeasGroupController } from './controller/ideas-group.controller';
import { IdeasGroupService } from './service/ideas-group.service';
import { IdeasController } from './controller/ideas.controller';
import { IdeasService } from './service/ideas.service';
import { ProductsController } from './controller/products.controller';
import { ProductsService } from './service/products.service';
import { ReasonsController } from './controller/reasons.controller';
import { ReasonsService } from './service/reasons.service';
import { IdeasGroupRepo } from './repo/ideas-group.repo';
import { ReasonRepo } from './repo/reason.repo';
import { IdeasRepo } from './repo/ideas.repo';
import { ProductRepo } from './repo/product.repo';
import {
  FiltersRepo,
  FilterValuesRepo,
  IdeasFiltersRepo,
  ProductFiltersRepo,
} from './repo/filters.repo';
import { AuthModule } from '@core/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [
    CategoryController,
    CategoryGroupController,
    FiltersController,
    IdeasGroupController,
    IdeasController,
    ProductsController,
    ReasonsController,
  ],
  providers: [
    CategoryService,
    CategoryRepo,

    CategoryGroupService,
    CategoryGroupRepo,

    FiltersService,
    FiltersRepo,
    FilterValuesRepo,

    IdeasGroupService,
    IdeasGroupRepo,
    IdeasFiltersRepo,

    IdeasService,
    IdeasRepo,

    ProductsService,
    ProductRepo,
    ProductFiltersRepo,

    ReasonsService,
    ReasonRepo,
  ],
})
export class AdminModule {}
