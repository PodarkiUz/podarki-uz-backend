import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { FileDto, IncludesDto, RouteDto } from 'src/travel/shared/dtos';
import { CurrencyType } from 'src/travel/shared/enums';
import { TourEntity } from 'src/travel/shared/repo/entity';

// Instagram API Response Types
export interface InstagramApiResponse {
  id: string;
  shortcode: string;
  thumbnail_src: string;
  display_url: string;
  video_url?: string;
  is_video: boolean;
  taken_at_timestamp: number;
  owner: {
    id: string;
    username: string;
    full_name: string;
    profile_pic_url: string;
  };
  edge_media_to_caption: {
    edges: Array<{
      node: {
        text: string;
      };
    }>;
  };
  edge_sidecar_to_children: {
    edges: Array<{
      node: {
        id: string;
        is_video: boolean;
        display_resources: Array<{
          src: string;
        }>;
      };
    }>;
  };
  edge_media_preview_like: {
    count: number;
  };
  edge_media_preview_comment: {
    count: number;
  };
  display_resources?: Array<{
    src: string;
  }>;
}

@Injectable()
export class InstagramService {
  private readonly logger = new Logger(InstagramService.name);
  private readonly rapidApiKeys: string[] | undefined;
  private readonly rapidApiHost: string =
    'instagram-scraper-stable-api.p.rapidapi.com';

  constructor() {
    this.rapidApiKeys = process.env.RAPID_API_KEYS?.split(',')?.map((key) =>
      key.trim(),
    );

    if (!this.rapidApiKeys || this.rapidApiKeys?.length === 0) {
      throw new Error('RAPID_API_KEYS is not configured');
    }
  }

  async getPostByUrl(postUrl: string): Promise<InstagramApiResponse | null> {
    try {
      this.logger.log(`Fetching Instagram post by URL: ${postUrl}`);

      const keys = this.rapidApiKeys;
      if (!keys || keys.length === 0) {
        throw new Error('RAPID_API_KEYS is not configured');
      }

      const response = await axios.get(
        `https://${this.rapidApiHost}/get_media_data.php`,
        {
          headers: {
            'X-RapidAPI-Key': keys[1],
            'X-RapidAPI-Host': this.rapidApiHost,
          },
          params: {
            reel_post_code_or_url: postUrl,
            type: 'post',
          },
          timeout: 10000,
        },
      );
      const responseData = response.data as InstagramApiResponse;
      if (responseData) {
        return responseData;
      }

      return null;
    } catch (error: any) {
      this.logger.error(
        `Error fetching Instagram post by URL ${postUrl}: ${
          error?.message || 'Unknown error'
        }`,
      );
      return null;
    }
  }

  convertToExternalTourFormat(
    parsedData: Partial<TourEntity>,
    uploadedImages: FileDto[],
  ) {
    // Convert uploaded images to external API format
    const files: FileDto[] = uploadedImages.map((img) => ({
      type: img.type,
      url: img.url,
      name: img.name,
      size: img.size,
    }));

    // Convert includes to external API format
    const includes: IncludesDto[] = [];
    if (parsedData.includes) {
      Object.entries(parsedData.includes).forEach(([key, value]) => {
        if (value) {
          includes.push({
            title: key.charAt(0).toUpperCase() + key.slice(1),
            included: true,
          });
        }
      });
    }

    // Convert route_json to external API format
    const route_json: RouteDto[] = [];
    if (parsedData.route_json && Array.isArray(parsedData.route_json)) {
      parsedData.route_json.forEach((route: any) => {
        route_json.push({
          title: route.title || 'Route Point',
          description: route.description || '',
        });
      });
    }

    // Handle title and description - ensure they're in the correct format
    const title =
      typeof parsedData.title === 'string'
        ? { en: parsedData.title, uz: parsedData.title, ru: parsedData.title }
        : parsedData.title || {
            en: 'Untitled Tour',
            uz: 'Untitled Tour',
            ru: 'Untitled Tour',
          };

    const description =
      typeof parsedData.description === 'string'
        ? {
            en: parsedData.description,
            uz: parsedData.description,
            ru: parsedData.description,
          }
        : parsedData.description || { en: '', uz: '', ru: '' };

    return {
      title,
      description,
      status: 1,
      location: parsedData.location || 0,
      price: parsedData.price || 0,
      sale_price: parsedData.sale_price || 0,
      duration: parsedData.duration || '',
      start_date:
        parsedData.start_date || null,
      currency: parsedData.currency || CurrencyType.UZS,
      seats: parsedData.seats || 0,
      files,
      route_json,
      includes,
      contact_phone: parsedData.contact_phone || [],
    };
  }

  isTourAnnouncement(caption: string): boolean {
    // Enhanced heuristic to determine if a post is a tour announcement
    const tourKeywords = [
      'tour',
      'trip',
      'travel',
      'vacation',
      'holiday',
      'journey',
      'destination',
      'package',
      'booking',
      'reservation',
      'price',
      'departure',
      'arrival',
      'hotel',
      'flight',
      'accommodation',
      'sayoh',
      'sayohat',
      'tur',
      'turlar',
      'aktual',
      'mavjud',
      'bron',
      'band',
      'joy',
      'narx',
      'narxi',
      "so'm",
      'dollar',
      '$',
      'Поход',
      'Поездка',
      'Стоимость',
      'стоимость',
      'поход',
      'поездка',
      'путешествие',
      'тур',
      'бронирование',
      'цена',
      'стоимость',
    ];

    const lowerCaption = caption?.toLowerCase();

    const keywordMatches = tourKeywords.filter((keyword) =>
      lowerCaption.includes(keyword.toLowerCase()),
    );

    // Check for price patterns
    const pricePattern = /(\d+[\s,]*)(?:so'm|dollar|\$|сум|руб|₽|₸)/i;
    const hasPrice = pricePattern.test(caption);

    // Check for date patterns
    const datePattern =
      /\d{1,2}[–-]\d{1,2}\s+(?:январь|февраль|март|апрель|май|июнь|июль|август|сентябрь|октябрь|ноябрь|декабрь|yanvar|fevral|mart|aprel|may|iyun|iyul|avgust|sentabr|oktabr|noyabr|dekabr|january|february|march|april|may|june|july|august|september|october|november|december)/i;
    const hasDate = datePattern.test(caption);

    // Check for contact information
    const contactPattern =
      /(?:📞|📱|☎️|@|telegram|whatsapp|phone|номер|телефон)/i;
    const hasContact = contactPattern.test(caption);

    // More flexible logic: if we have keywords OR price OR date OR contact, it's likely a tour announcement
    const result =
      keywordMatches.length >= 1 || hasPrice || hasDate || hasContact;

    this.logger.debug(
      `Instagram post analysis: keywords=${keywordMatches.length}, price=${hasPrice}, date=${hasDate}, contact=${hasContact}, isTour=${result}`,
    );

    return result;
  }
}
