import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserHolidaysService } from '../service/user-holidays.service';
import {
  CreateUserHolidayDto,
  DeleteUserHolidayDto,
  GetUserHolidaysDto,
  UpdateUserHolidayDto,
} from '../dto/user-holidays.dto';
import { AuthorizationJwtGuard } from '@core/auth/guards/authorization.jwt.guard';
import { CurrentUser } from '@shared/decorator/current-user.decorator';
import { ICurrentUser } from '@shared/interfaces/current-user';

@ApiTags('CLIENT -> HOLIDAYS')
@ApiBearerAuth('authorization')
@UseGuards(AuthorizationJwtGuard)
@Controller('client/holidays')
export class UserHolidaysController {
  constructor(private readonly userHolidaysService: UserHolidaysService) {}

  @Post('create')
  create(
    @Body() body: CreateUserHolidayDto,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.userHolidaysService.create(body, currentUser);
  }

  @Post('delete')
  delete(@Body() body: DeleteUserHolidayDto) {
    return this.userHolidaysService.delete(body.id);
  }

  @Post('update')
  update(@Body() body: UpdateUserHolidayDto) {
    return this.userHolidaysService.update(body.id, body);
  }

  @Post('get-list')
  getAll(@Body() body: GetUserHolidaysDto) {
    return this.userHolidaysService.getAllList(body);
  }
}
