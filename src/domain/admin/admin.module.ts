import { Module } from '@nestjs/common';
import { CategoryController } from './controller/category.controller';
import { CategoryService } from './service/category.service';
import { CategoryRepo } from './repo/category.repo';
import { CategoryGroupService } from './service/category-group.service';
import { CategoryGroupRepo } from './repo/category-group.repo';
import { CategoryGroupController } from './controller/category-group.controller';

@Module({
  controllers: [CategoryController, CategoryGroupController],
  providers: [
    CategoryService,
    CategoryRepo,
    CategoryGroupService,
    CategoryGroupRepo,
  ],
})
export class AdminModule {}
