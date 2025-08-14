import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { TourEntity } from 'src/travel/shared/repo/entity';

@Injectable()
export class OpenAIService {
  private readonly logger = new Logger(OpenAIService.name);
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    // DEBUG: Print the API key being used (REMOVE after debugging!)
    console.log('DEBUG OPENAI_API_KEY:', apiKey);
    if (!apiKey) {
      return;
      throw new Error('OPENAI_API_KEY is not configured');
    }
    this.openai = new OpenAI({ apiKey });
  }

  async parseTourAnnouncementFromTelegram(
    rawText: string,
  ): Promise<Partial<TourEntity>[]> {
    // Throttle: wait 1.5 seconds before making the API call
    await new Promise((res) => setTimeout(res, 1500));
    try {
      const prompt = `
        Parse the following Telegram tour announcement text and extract ALL tours mentioned.
        A single message may contain multiple tours. Return the result as a valid JSON array of tour objects.
        
        Each tour object should have the following fields:
        - title: object with language keys (e.g., {"en": "Tour Title", "ru": "Название тура", "uz": "Tur nomi"}) (required)
        - description: object with language keys, more detailed description of the tour (e.g., {"en": "Description", "ru": "Описание", "uz": "Tavsif"}) (optional)
        - price: number (tour price, extract numeric value only) (required)
        - salePrice: number (discounted price if mentioned) (optional)
        - duration: string (e.g., "5 days", "1 week", "3 nights") (optional)
        - startDate: string in YYYY-MM-DD format, if not mentioned then return null
        - seats: number (maximum participants/available seats) (optional)
        - includes: object with included services (e.g., {"accommodation": true, "meals": true, "transport": true}) (optional)

        If a field cannot be extracted from the text, omit it from the JSON response.
        Only return valid JSON array, no additional text or explanations.
        For prices, extract only the numeric value without currency symbols.
        For dates, use YYYY-MM-DD format.
        For multi-language fields, use language codes as keys.
        
        IMPORTANT: If there are multiple tours in the message, create a separate object for each tour.

        Telegram text:
        ${rawText}
      `;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant that parses tour announcements and returns structured JSON data compatible with a tours database. Always respond with valid JSON array only, even if there is only one tour.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.1,
        max_tokens: 2000,
      });

      let responseText = completion.choices[0]?.message?.content;

      if (!responseText) {
        throw new Error('No response from OpenAI');
      }

      // Remove code block markers if present
      responseText = responseText.replace(/```json|```/g, '').trim();

      // Try to parse the JSON response
      const parsedData: Partial<TourEntity>[] = JSON.parse(
        responseText,
      ) as Partial<TourEntity>[];

      // Ensure it's an array
      const toursArray = Array.isArray(parsedData) ? parsedData : [parsedData];

      this.logger.log(
        `Successfully parsed ${toursArray.length} tour(s) from announcement`,
      );

      return toursArray;
    } catch (error: any) {
      // Enhanced error logging
      if (error.response) {
        console.error(
          'OpenAI API Error:',
          error.response.status,
          error.response.statusText,
        );
        console.error('Headers:', error.response.headers);
        console.error('Data:', error.response.data);
      } else {
        console.error('OpenAI API Error:', error.message);
      }
      throw error;
    }
  }

  async parseTourAnnouncementFromInstagram(
    rawText: string,
  ): Promise<Partial<TourEntity>[]> {
    // Throttle: wait 1.5 seconds before making the API call
    await new Promise((res) => setTimeout(res, 1500));
    try {
      const prompt = `
        Parse the following Telegram tour announcement text and extract ALL tours mentioned.
        A single message may contain multiple tours. Return the result as a valid JSON array of tour objects.
        
        Each tour object should have the following fields:
        - title: object with language keys (e.g., {"en": "Tour Title", "ru": "Название тура", "uz": "Tur nomi"}) (required)
        - description: object with language keys, more detailed description of the tour (e.g., {"en": "Description", "ru": "Описание", "uz": "Tavsif"}) (optional)
        - price: number (tour price, extract numeric value only) (required)
        - sale_price: number (discounted price if mentioned) (optional)
        - duration: string (e.g., "5 days", "1 week", "3 nights") (optional)
        - start_date: string in YYYY-MM-DD format (optional), if not mentioned then return null
        - start_location: string (optional), if not mentioned then return null
        - seats: number (maximum participants/available seats) (optional)
        - includes: object with included services (e.g., {"accommodation": true, "meals": true, "transport": true}) (optional)
        - currency: string (currency of the tour, e.g., "UZS", "USD", "EUR") (optional)

        If a field cannot be extracted from the text, omit it from the JSON response.
        Only return valid JSON array, no additional text or explanations.
        For prices, extract only the numeric value without currency symbols.
        For dates, use YYYY-MM-DD format.
        For multi-language fields, use language codes as keys.
        
        IMPORTANT: If there are multiple tours in the message, create a separate object for each tour.

        Instagram text:
        ${rawText}
      `;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant that parses tour announcements and returns structured JSON data compatible with a tours database. Always respond with valid JSON array only, even if there is only one tour.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.1,
        max_tokens: 2000,
      });

      let responseText = completion.choices[0]?.message?.content;

      if (!responseText) {
        throw new Error('No response from OpenAI');
      }

      // Remove code block markers if present
      responseText = responseText.replace(/```json|```/g, '').trim();

      // Try to parse the JSON response
      const parsedData: Partial<TourEntity>[] = JSON.parse(
        responseText,
      ) as Partial<TourEntity>[];

      // Ensure it's an array
      const toursArray: Partial<TourEntity>[] = Array.isArray(parsedData)
        ? parsedData
        : [parsedData];

      this.logger.log(
        `Successfully parsed ${toursArray.length} tour(s) from announcement`,
      );

      return toursArray;
    } catch (error: any) {
      // Enhanced error logging
      if (error.response) {
        console.error(
          'OpenAI API Error:',
          error.response.status,
          error.response.statusText,
        );
        console.error('Headers:', error.response.headers);
        console.error('Data:', error.response.data);
      } else {
        console.error('OpenAI API Error:', error.message);
      }
      throw error;
    }
  }

  async validateParsedData(data: any): Promise<boolean> {
    try {
      const validationPrompt = `
        Validate if the following tour data is complete and reasonable for a tours database.
        Check if:
        1. Title is present and meaningful (either as string or multi-language object)
        2. Start date is in valid format (YYYY-MM-DD) if present
        3. Price is a positive number if present
        4. Duration is reasonable if present
        5. Seats is a positive integer if present
        
        Return only "VALID" or "INVALID" with a brief reason.
        
        Data: ${JSON.stringify(data, null, 2)}
      `;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are a validation assistant. Respond with "VALID" or "INVALID" followed by a brief reason.',
          },
          {
            role: 'user',
            content: validationPrompt,
          },
        ],
        temperature: 0.1,
        max_tokens: 100,
      });

      const response = completion.choices[0]?.message?.content?.toUpperCase();
      return response?.startsWith('VALID') || false;
    } catch (error) {
      this.logger.error(`Error validating parsed data: ${error.message}`);
      return false;
    }
  }

  async validateMultipleTours(tours: any[]): Promise<boolean[]> {
    const validationResults: boolean[] = [];

    for (const tour of tours) {
      const isValid = await this.validateParsedData(tour);
      validationResults.push(isValid);
    }

    return validationResults;
  }
}
