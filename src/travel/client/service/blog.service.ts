import { Injectable } from '@nestjs/common';
import { BlogRepo } from 'src/travel/shared/repo/blogs.repo';
import { GetBlogListClientDto } from '../dto/blog.dto';

@Injectable()
export class BlogService {
  constructor(private readonly repo: BlogRepo) {}

  async getClientBlogist(params: GetBlogListClientDto) {
    const data = await this.repo.getAllBlogs(params);
    return { data, total: Number(data[0]?.total) || 0 };
  }
}