import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class TelegramBotService {
  private readonly botToken: string;
  private readonly botApiUrl: string;

  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!this.botToken) {
      throw new BadRequestException('Telegram bot token not configured');
    }
    this.botApiUrl = `https://api.telegram.org/bot${this.botToken}`;
  }

  /**
   * Send OTP message to user via Telegram
   */
  async sendOtpMessage(username: string, otpCode: string): Promise<boolean> {
    try {
      // First, get chat ID by username
      const chatId = await this.getChatIdByUsername(username);
      
      if (!chatId) {
        throw new BadRequestException(`User @${username} not found or not started the bot`);
      }

      // Send OTP message
      const message = `🔐 Your verification code is: **${otpCode}**\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, please ignore this message.`;

      const response = await axios.post(`${this.botApiUrl}/sendMessage`, {
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      });

      return response.data.ok;
    } catch (error) {
      console.error('Error sending Telegram OTP:', error);
      throw new BadRequestException('Failed to send OTP via Telegram: ' + error.message);
    }
  }

  /**
   * Get chat ID by username
   */
  private async getChatIdByUsername(username: string): Promise<number | null> {
    try {
      // Remove @ if present
      const cleanUsername = username.startsWith('@') ? username.slice(1) : username;
      
      // Try to get updates to find the user
      const response = await axios.get(`${this.botApiUrl}/getUpdates`);
      
      if (response.data.ok) {
        const updates = response.data.result;
        
        // Find the user in recent updates
        for (const update of updates) {
          if (update.message?.from?.username === cleanUsername) {
            return update.message.chat.id;
          }
        }
      }

      // If not found in updates, try to send a message to get chat ID
      // This will only work if the user has already started the bot
      const testResponse = await axios.post(`${this.botApiUrl}/sendMessage`, {
        chat_id: `@${cleanUsername}`,
        text: 'Verifying your account...',
      });

      if (testResponse.data.ok) {
        return testResponse.data.result.chat.id;
      }

      return null;
    } catch (error) {
      console.error('Error getting chat ID:', error);
      return null;
    }
  }

  /**
   * Verify if a username exists and is accessible
   */
  async verifyUsername(username: string): Promise<boolean> {
    try {
      const chatId = await this.getChatIdByUsername(username);
      return chatId !== null;
    } catch (error) {
      return false;
    }
  }

  /**
 * Get user information from Telegram
 */
async getUserInfo(username: string): Promise<{
    id: number;
    first_name: string;
    last_name?: string;
    username: string;
    photo_url?: string;
  } | null> {
    try {
      // Remove @ if present
      const cleanUsername = username.startsWith('@') ? username.slice(1) : username;
      
      // Try to get user info from recent updates
      const response = await axios.get(`${this.botApiUrl}/getUpdates`);
      
      if (response.data.ok) {
        const updates = response.data.result;
        
        // Find the user in recent updates
        for (const update of updates) {
          if (update.message?.from?.username === cleanUsername) {
            const user = update.message.from;
            return {
              id: user.id,
              first_name: user.first_name,
              last_name: user.last_name,
              username: user.username,
            };
          }
        }
      }
  
      // If not found in updates, try to get user info by sending a message
      const testResponse = await axios.post(`${this.botApiUrl}/sendMessage`, {
        chat_id: `@${cleanUsername}`,
        text: 'Getting your profile information...',
      });
  
      if (testResponse.data.ok) {
        // Get user info from the response
        const chat = testResponse.data.result.chat;
        return {
          id: chat.id,
          first_name: chat.first_name || cleanUsername,
          last_name: chat.last_name,
          username: cleanUsername,
          photo_url: chat.photo?.small_file_id ? 
            `https://api.telegram.org/file/bot${this.botToken}/${chat.photo.small_file_id}` : 
            undefined
        };
      }
  
      return null;
    } catch (error) {
      console.error('Error getting user info:', error);
      return null;
    }
  }
}
