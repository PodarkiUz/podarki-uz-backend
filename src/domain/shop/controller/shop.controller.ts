import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ShopService } from '../service/shop.service';
import { CreateShopDto, UpdateShopDto } from '../dto/shop.dto';
import { AuthorizationJwtGuard } from '@core/auth/guards/authorization.jwt.guard';
import { CurrentUser } from '@shared/decorator/current-user.decorator';
import { ICurrentUser } from '@shared/interfaces/current-user';

@ApiTags('SHOP')
@ApiBearerAuth('authorization')
@UseGuards(AuthorizationJwtGuard)
@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) { }

  @Post('create')
  create(@Body() body: CreateShopDto,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.shopService.create(body, currentUser);
  }

  @Post('delete')
  delete(@Body() body: UpdateShopDto) {
    return this.shopService.delete(body.id);
  }

  @Post('update')
  update(@Body() body: UpdateShopDto) {
    return this.shopService.update(body.id, body);
  }

  @Post('get-list')
  getAll() {
    return this.shopService.getAllList();
  }
}
