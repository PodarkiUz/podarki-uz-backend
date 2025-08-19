import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateBlogDto, UpdateBlogDto, BlogStatusDto } from '../dto/blog.dto';
import { PaginationParams } from 'src/travel/shared/interfaces';
import { BlogRepo } from 'src/travel/shared/repo/blogs.repo';

@Injectable()
export class BlogService {
  constructor(private readonly repo: BlogRepo) {}

  async create(params: CreateBlogDto) {
    const blog = await this.repo.insert({
      title: params.title,
      description: params.description,
      author: params.author,
      status: params.status || 0, // Default to draft
    });

    return { success: true, data: blog };
  }

  async getAllList(params: PaginationParams) {
    const data = await this.repo.getAllBlogs(params);
    return { 
      data, 
      total: Number(data[0]?.total) || 0 
    };
  }

  async getOne(id: string) {
    const blog = await this.repo.getBlogById(id);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    return blog;
  }

  async update(id: string, params: UpdateBlogDto) {
    const existingBlog = await this.repo.getBlogById(id);
    if (!existingBlog) {
      throw new NotFoundException('Blog not found');
    }

    const updateData: any = {};
    
    if (params.title !== undefined) {
      updateData.title = params.title;
    }
    if (params.description !== undefined) {
      updateData.description = params.description;
    }
    if (params.author !== undefined) {
      updateData.author = params.author;
    }
    if (params.status !== undefined) {
      updateData.status = params.status;
    }

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException('No fields to update');
    }

    const updatedBlog = await this.repo.updateById(id, updateData);
    return { success: true, data: updatedBlog };
  }

  async delete(id: string) {
    const existingBlog = await this.repo.getBlogById(id);
    if (!existingBlog) {
      throw new NotFoundException('Blog not found');
    }

    await this.repo.updateById(id, { is_deleted: true });
    return { success: true };
  }

  async updateStatus(params: BlogStatusDto) {
    const existingBlog = await this.repo.getBlogById(params.id);
    if (!existingBlog) {
      throw new NotFoundException('Blog not found');
    }

    const updatedBlog = await this.repo.updateById(params.id, { 
      status: params.status 
    });
    return { success: true, data: updatedBlog };
  }

  async getActiveBlogs(limit = 10) {
    const blogs = await this.repo.getActiveBlogs(limit);
    return { data: blogs };
  }

  async searchBlogs(query: string, limit = 10) {
    const blogs = await this.repo.searchBlogs(query, limit);
    return { data: blogs };
  }
}