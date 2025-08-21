import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BlogService } from '../service/blog.service';
import { PaginationDto } from 'src/travel/shared/dtos';

@ApiTags('BLOG')
@Controller('blog')
export class BlogController {
  constructor(private readonly service: BlogService) {}

  @Post('list')
  getAll(@Body() body: PaginationDto) {
    return this.service.getClientBlogist(body);
  }
}