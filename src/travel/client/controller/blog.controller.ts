import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BlogService } from '../service/blog.service';
import { OneByIdDto, PaginationDto } from 'src/travel/shared/dtos';

@ApiTags('BLOG')
@Controller('blog')
export class BlogController {
  constructor(private readonly service: BlogService) {}

  @Post('list')
  getAll(@Body() body: PaginationDto) {
    return this.service.getClientBlogList(body);
  }

  @Post('get-by-id')
  getOne(@Body() params: OneByIdDto) {
    return this.service.getClientBlogById(params.id);
  }
}