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
import {
    TelegramPhoneDto,
    TelegramGatewayOtpDto,
} from '../dto/telegram-gateway-auth.dto';

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

    @ApiBody({ type: TelegramPhoneDto })
    @Post('send-gateway-otp')
    async sendTelegramGatewayOtp(@Body() params: TelegramPhoneDto) {
        return await this.telegramAuthService.sendTelegramGatewayOtp(params);
    }

    @ApiBody({ type: TelegramGatewayOtpDto })
    @Post('verify-gateway-otp')
    async verifyTelegramGatewayOtp(@Body() params: TelegramGatewayOtpDto) {
        return await this.telegramAuthService.verifyTelegramGatewayOtp(params);
    }
}
