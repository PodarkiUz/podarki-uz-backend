import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  Delete,
  Get,
  Query,
} from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import { AdminUserService } from '../service/user.service';
import { RootGuard } from 'src/guard/root.guard';
import { ListPageDto } from 'src/shared/dto/list.dto';
import { AdminSignInDto, CreateAdminDto } from '../dto/user-admin.dto';

@ApiTags('Admin')
@Controller('root')
export class SuperAdminController {
  constructor(private readonly adminUserService: AdminUserService) {}

  @ApiBasicAuth('basic')
  @UseGuards(RootGuard)
  @Post('create-superadmin')
  async createSuperAdmin(@Body() params: CreateAdminDto) {
    return this.adminUserService.createSuperAdmin(params);
  }

  @ApiBasicAuth('basic')
  @UseGuards(RootGuard)
  @Post('list')
  async list(@Body() params: ListPageDto) {
    return this.adminUserService.findAllAdmins(params);
  }

  @ApiBasicAuth('basic')
  @UseGuards(RootGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.adminUserService.delete(id);
  }

  @Post('sign-in')
  async signIn(@Body() params: AdminSignInDto) {
    return this.adminUserService.adminSignIn(params);
  }
}
