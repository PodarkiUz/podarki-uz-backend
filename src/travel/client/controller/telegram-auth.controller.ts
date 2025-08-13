import {
    Body,
    Controller,
    Post,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { TelegramAuthService } from '../service/telegram-auth.service';
import {
    TelegramUsernameDto,
    TelegramOtpDto,
} from '../dto/telegram-auth.dto';

@ApiTags('CLIENT - TELEGRAM AUTH')
@Controller('client/telegram-auth')
export class TelegramAuthController {
    constructor(private readonly telegramAuthService: TelegramAuthService) { }

    @ApiBody({ type: TelegramUsernameDto })
    @Post('send-telegram-otp')
    async sendTelegramOtp(@Body() params: TelegramUsernameDto) {
        return await this.telegramAuthService.sendTelegramOtp(params);
    }

    @ApiBody({ type: TelegramOtpDto })
    @Post('verify-telegram-otp')
    async verifyTelegramOtp(@Body() params: TelegramOtpDto) {
        return await this.telegramAuthService.verifyTelegramOtp(params);
    }
}
