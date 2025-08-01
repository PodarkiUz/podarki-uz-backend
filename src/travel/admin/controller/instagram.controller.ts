import { Controller, Post, Body, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  ProcessInstagramPostDto,
  ProcessInstagramPostResponseDto,
} from '../dto/instagram.dto';
import {
  InstagramService,
  InstagramApiResponse,
} from '../service/instagram.service';
import { TourService } from '../service/tour.service';
import { OpenAIService } from '../service/openai.service';
import { InstagramPostsRepo } from 'src/travel/shared/repo/instagram-posts.repo';
import { FileDto } from 'src/travel/shared/dtos';
import { FileType } from 'src/travel/shared/enums';

@ApiTags('Instagram')
@Controller('instagram')
export class InstagramController {
  private readonly logger = new Logger(InstagramController.name);

  constructor(
    private readonly instagramService: InstagramService,
    private readonly openAIService: OpenAIService,
    private readonly instagramPostRepository: InstagramPostsRepo,
    private tourService: TourService,
  ) {}

  @Post('fetch-post')
  @ApiOperation({ summary: 'Fetch Instagram post' })
  @ApiResponse({ status: 200, description: 'Post fetched successfully' })
  async fetchPost(@Body() params: ProcessInstagramPostDto) {
    const post = await this.instagramService.getPostByUrl(params.postUrl);
    await this.instagramPostRepository.insert({
      id: this.instagramPostRepository.generateRecordId(),
      username: post?.owner.username,
      post_id: post?.id,
      response_json: post,
      attempt: 0,
    });

    return {
      message: 'Post fetched successfully',
      post,
    };
  }

  @Post('get-unprocessed-posts')
  @ApiOperation({ summary: 'Get unprocessed posts' })
  @ApiResponse({
    status: 200,
    description: 'Unprocessed posts fetched successfully',
  })
  async getUnProcessedPosts() {
    const posts = await this.instagramPostRepository.getOne({
      processed: false,
    });
    return posts;
  }

  @Post('create-tour-from-post')
  @ApiOperation({
    summary:
      'Create tour directly from Instagram post using createWithoutAuth API',
  })
  @ApiResponse({ status: 200, description: 'Tour created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid post data' })
  async createTourFromPost(@Body() dto: ProcessInstagramPostResponseDto) {
    const { response_json: post } = await this.instagramPostRepository.getById(
      dto.id,
    );
    const postData = post as InstagramApiResponse;

    if (!postData) {
      return { message: 'Post not found', success: false };
    }

    // Check if it's a tour announcement
    const isTourAnnouncement = this.instagramService.isTourAnnouncement(
      postData.edge_media_to_caption.edges[0].node.text,
    );
    if (!isTourAnnouncement) {
      return { message: 'Post is not a tour announcement', success: false };
    }

    // Get organizer ID from Instagram channel config
    const { getInstagramChannelConfig } = await import(
      '../config/instagram-channels'
    );
    const channelConfig = getInstagramChannelConfig(post.owner.username);
    const organizerId =
      channelConfig?.organizerId || '65c38ad9dcf8140001d4fa31';

    // Download and upload images if requested
    const uploadedImages: FileDto[] = [];

    if (
      postData?.edge_sidecar_to_children?.edges &&
      postData?.edge_sidecar_to_children?.edges?.length > 0
    ) {
      for (const image of postData.edge_sidecar_to_children.edges) {
        uploadedImages.push({
          url: image.node.display_resources[0].src,
          name: 'image.jpg',
          size: 100,
          type:
            postData.edge_sidecar_to_children.edges.findIndex(
              (edge) => edge.node.id === image.node.id,
            ) == dto.mainImageIndex
              ? FileType.main
              : FileType.extra,
        });
      }
    } else if (
      postData?.display_resources &&
      postData?.display_resources?.length > 0
    ) {
      uploadedImages.push({
        url: postData.display_resources[0].src,
        name: 'image.jpg',
        size: 100,
        type: FileType.main,
      });
    }
    // Extract post text
    const postText = postData.edge_media_to_caption.edges[0].node.text;

    // Parse with OpenAI to get structured tour data
    const parsedTours =
      await this.openAIService.parseTourAnnouncementFromInstagram(postText);

    if (parsedTours.length === 0) {
      return {
        message: 'No tour data could be extracted from the post',
        success: false,
        post: postData,
      };
    }

    // Create tours using the external API
    const createdTours: any[] = [];

    for (const parsedData of parsedTours) {
      // Convert to external API format
      const externalTourData =
        this.instagramService.convertToExternalTourFormat(
          parsedData,
          uploadedImages,
        );
      // Create tour in external API using createWithoutAuth
      const externalTour = await this.tourService.createWithoutAuth(
        externalTourData,
      );

      if (externalTour !== null) {
        await this.instagramPostRepository.updateById(dto.id, {
          processed: true,
        });
      }

      if (externalTour) {
        createdTours.push({
          tourId: externalTour.id,
          title: parsedData?.title,
          price: parsedData?.price,
          organizerId: organizerId,
        });
      }
    }

    return {
      message: 'Tours created successfully',
      success: true,
      post: postData,
      toursCreated: createdTours.length,
      tours: createdTours,
      isTourAnnouncement: true,
    };
  }

  // @Get('proxy-image')
  // @ApiOperation({ summary: 'Proxy Instagram image to avoid CORS issues' })
  // @ApiResponse({ status: 200, description: 'Image served successfully' })
  // @ApiResponse({ status: 400, description: 'Invalid image URL' })
  // @ApiResponse({ status: 500, description: 'Failed to fetch image' })
  // async proxyImage(@Query('url') imageUrl: string, @Res() res: Response) {
  //   if (!imageUrl) {
  //     return res.status(400).json({ error: 'Image URL is required' });
  //   }

  //   try {
  //     this.logger.log(`Proxying image from: ${imageUrl}`);

  //     // Fetch the image from Instagram CDN
  //     const response = await axios.get(imageUrl, {
  //       responseType: 'arraybuffer',
  //       timeout: 30000,
  //       headers: {
  //         'User-Agent':
  //           'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  //         Referer: 'https://www.instagram.com/',
  //         Accept: 'image/webp,image/apng,image/*,*/*;q=0.8',
  //         'Accept-Language': 'en-US,en;q=0.9',
  //         'Cache-Control': 'no-cache',
  //       },
  //     });

  //     // Set appropriate headers for the response
  //     res.set({
  //       'Content-Type': response.headers['content-type'] || 'image/jpeg',
  //       'Content-Length': response.headers['content-length'],
  //       'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
  //       'Access-Control-Allow-Origin': '*',
  //       'Access-Control-Allow-Methods': 'GET',
  //       'Access-Control-Allow-Headers': 'Content-Type',
  //     });

  //     // Send the image buffer
  //     res.send(response.data);
  //   } catch (error) {
  //     this.logger.error(
  //       `Error proxying image from ${imageUrl}: ${error.message}`,
  //     );

  //     // Return a placeholder image or error
  //     res.status(500).json({
  //       error: 'Failed to fetch image',
  //       originalUrl: imageUrl,
  //       message: error.message,
  //     });
  //   }
  // }
}
