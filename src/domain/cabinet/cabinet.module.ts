import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CabinetShopController } from './controller/shop.controller';
import { CabinetShopService } from './service/shop.service';
import { AdminShopRepo } from '../admin/repo/shop.repo';

@Module({
  controllers: [CabinetShopController],
  providers: [JwtService, CabinetShopService, AdminShopRepo],
})
export class CabinetModule { }
