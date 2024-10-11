import { Module } from '@nestjs/common';
import { CategoryController } from './controller/category.controller';
import { CategoryService } from './service/category.service';
import { CategoryRepo } from './repo/category.repo';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepo],
})
export class AdminModule {}
