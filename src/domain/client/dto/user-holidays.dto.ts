import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ICreateUserHolidaysParam } from '../interface/user-holidays.interface';
import { IsDate, IsISO8601, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserHolidayDto implements ICreateUserHolidaysParam {
  @ApiProperty()
  @IsString()
  user_id: string;

  @ApiProperty()
  @IsString()
  holiday_name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsISO8601()
  holiday_date: Date;

  @ApiProperty()
  @IsDate()
  notification_date?: Date;
}

export class DeleteUserHolidayDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class UpdateUserHolidayDto extends PartialType(CreateUserHolidayDto) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class GetUserHolidaysDto {
  @ApiProperty()
  @IsString()
  user_id: string;
}
