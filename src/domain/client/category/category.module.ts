import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategoryRepo } from './category.repo';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from 'src/domain/client/user/user.module';

@Module({
  imports: [UserModule],
  // controllers: [CategoryController],
  providers: [CategoryService, CategoryRepo, JwtService],
})
export class CategoryModule {}
