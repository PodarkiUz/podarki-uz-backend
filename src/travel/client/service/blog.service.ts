import { Injectable } from '@nestjs/common';
import { BlogRepo } from 'src/travel/shared/repo/blogs.repo';
import { GetBlogListClientDto } from '../dto/blog.dto';

@Injectable()
export class BlogService {
  constructor(private readonly repo: BlogRepo) {}

  async getClientBlogList(params: GetBlogListClientDto) {
    const data = await this.repo.getClientBlogs(params);
    return { data, total: Number(data[0]?.total) || 0 };
  }
}