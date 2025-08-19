import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BlogService } from '../service/blog.service';
import { CreateBlogDto, UpdateBlogDto, BlogStatusDto } from '../dto/blog.dto';
import { OneByIdDto, PaginationDto } from 'src/travel/shared/dtos';
import { AuthorizationJwtGuard } from 'src/travel/core/auth/guards/authorization.jwt.guard';

@ApiTags('ADMIN -> BLOG')
@ApiBearerAuth('authorization')
@UseGuards(AuthorizationJwtGuard)
@Controller('admin/blog')
export class BlogController {
  constructor(private readonly service: BlogService) {}

  @Post('create')
  create(@Body() body: CreateBlogDto) {
    return this.service.create(body);
  }

  @Post('delete')
  delete(@Body() body: OneByIdDto) {
    return this.service.delete(body.id);
  }

  @Post('update')
  update(@Body() body: UpdateBlogDto) {
    return this.service.update(body.id, body);
  }

  @Post('list')
  getAll(@Body() body: PaginationDto) {
    return this.service.getAllList(body);
  }

  @Post('get-by-id')
  getOne(@Body() params: OneByIdDto) {
    return this.service.getOne(params.id);
  }

  @Post('update-status')
  updateStatus(@Body() body: BlogStatusDto) {
    return this.service.updateStatus(body);
  }

  @Post('active-blogs')
  getActiveBlogs(@Body() body: { limit?: number }) {
    return this.service.getActiveBlogs(body.limit || 10);
  }

  @Post('search')
  searchBlogs(@Body() body: { query: string; limit?: number }) {
    return this.service.searchBlogs(body.query, body.limit || 10);
  }
}