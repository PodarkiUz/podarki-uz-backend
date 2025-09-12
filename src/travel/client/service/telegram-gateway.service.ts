import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';

interface SendVerificationMessageRequest {
    phone_number: string;
    code_length?: number;
    ttl?: number;
    payload?: string;
    callback_url?: string;
}

interface SendVerificationMessageResponse {
    ok: boolean;
    result?: {
        request_id: string;
        phone_number: string;
        code_length: number;
        ttl: number;
    };
    error?: string;
}

interface CheckVerificationStatusRequest {
    request_id: string;
    code: string;
}

interface CheckVerificationStatusResponse {
    ok: boolean;
    result?: {
        verification_status: {
            status: 'code_valid' | 'code_invalid' | 'code_expired' | 'request_not_found';
        };
    };
    error?: string;
}

@Injectable()
export class TelegramGatewayService {
    private readonly apiToken: string;
    private readonly baseUrl: string;

    constructor() {
        this.apiToken = process.env.TELEGRAM_GATEWAY_API_TOKEN;
        if (!this.apiToken) {
            return;
            throw new BadRequestException('Telegram Gateway API token not configured');
        }
        this.baseUrl = 'https://gatewayapi.telegram.org/';
    }

    /**
     * Send verification code via Telegram Gateway API
     */
    async sendVerificationMessage(params: {
        phoneNumber: string;
        codeLength?: number;
        ttl?: number;
        payload?: string;
        callbackUrl?: string;
    }): Promise<{ requestId: string; phoneNumber: string }> {
        try {
            const requestData: SendVerificationMessageRequest = {
                phone_number: this.formatPhoneNumber(params.phoneNumber),
                code_length: params.codeLength || 6,
                ttl: params.ttl || 600, // 10 minutes default
                payload: params.payload,
                callback_url: params.callbackUrl,
            };

            const response = await axios.post<SendVerificationMessageResponse>(
                `${this.baseUrl}sendVerificationMessage`,
                requestData,
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data.ok && response.data.result) {
                return {
                    requestId: response.data.result.request_id,
                    phoneNumber: response.data.result.phone_number,
                };
            } else {
                throw new BadRequestException(
                    `Failed to send verification code: ${response.data.error || 'Unknown error'}`
                );
            }
        } catch (error) {
            console.error('Error sending verification code via Gateway API:', error);
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.error || error.message;
                throw new BadRequestException(`Failed to send verification code: ${errorMessage}`);
            }
            throw new BadRequestException('Failed to send verification code via Telegram Gateway');
        }
    }

    /**
     * Check verification status
     */
    async checkVerificationStatus(requestId: string, code: string): Promise<boolean> {
        try {
            const requestData: CheckVerificationStatusRequest = {
                request_id: requestId,
                code: code,
            };

            const response = await axios.post<CheckVerificationStatusResponse>(
                `${this.baseUrl}checkVerificationStatus`,
                requestData,
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data.ok && response.data.result) {
                return response.data.result.verification_status.status === 'code_valid';
            } else {
                console.error('Verification check failed:', response.data.error);
                return false;
            }
        } catch (error) {
            console.error('Error checking verification status:', error);
            return false;
        }
    }

    /**
     * Format phone number to E.164 format
     */
    formatPhoneNumber(phoneNumber: string): string {
        // Remove all non-digit characters
        const digits = phoneNumber.replace(/\D/g, '');

        // If it doesn't start with country code, assume it's a local number
        // You might want to add more sophisticated phone number validation here
        if (digits.length === 9 && !digits.startsWith('998')) {
            // Assume Uzbekistan number if 9 digits
            return `+998${digits}`;
        } else if (digits.length === 12 && digits.startsWith('998')) {
            return `+${digits}`;
        } else if (digits.length === 13 && digits.startsWith('998')) {
            return `+${digits}`;
        } else if (phoneNumber.startsWith('+')) {
            return phoneNumber;
        } else {
            // Try to add + if it looks like an international number
            return `+${digits}`;
        }
    }

    /**
     * Validate phone number format
     */
    validatePhoneNumber(phoneNumber: string): boolean {
        const formatted = this.formatPhoneNumber(phoneNumber);
        // Basic E.164 format validation
        return /^\+[1-9]\d{1,14}$/.test(formatted);
    }
}
