import { BaseRepo } from '@shared/providers/base-dao';
import { Injectable } from '@nestjs/common';
import { BlogEntity } from './entity';
import { PaginationParams } from '../interfaces';
import { isEmpty } from 'lodash';
import { FileDependentType, StatusEnum } from '../enums';

@Injectable()
export class BlogRepo extends BaseRepo<BlogEntity> {
  constructor() {
    super('blogs');
  }

  getAllBlogs(params: PaginationParams) {
    const knex = this.knex;
    const { offset = 0, limit = 10 } = params;
    const query = knex
      .select([
        'blog.*',
        knex.raw('count(blog.id) over() as total'),
        knex.raw(
            `COALESCE(
              jsonb_agg(
                jsonb_build_object(
                  'id', file.id,
                  'url', file.url,
                  'type', file.type
                )
              ) filter (where file.id is not null), '[]') AS files`,
          ),
      ])
      .from(`${this.tableName} as blog`)
      .leftJoin('files as file', function () {
        this.on(knex.raw(`file.depend = '${FileDependentType.blog}'`)).andOn(
          'file.dependent_id',
          'blog.id',
        );
      })
      .where('blog.is_deleted', false)
      .orderBy('blog.created_at', 'desc')
      .groupBy('blog.id');

    if (!isEmpty(params?.search)) {
      query.whereRaw(`(
        blog.title ilike '%${params.search}%'
        or blog.description ilike '%${params.search}%'
        or blog.author ilike '%${params.search}%'
        )`);
    }

    if (limit) {
      query.limit(limit);
      if (offset) {
        query.offset(offset);
      }
    }

    return query;
  }

  getClientBlogs(params: PaginationParams) {
    const knex = this.knex;
    const { offset = 0, limit = 10 } = params;
    const query = knex
      .select([
        'blog.*',
        knex.raw('count(blog.id) over() as total'),
        knex.raw(
            `COALESCE(
              jsonb_agg(
                jsonb_build_object(
                  'id', file.id,
                  'url', file.url,
                  'type', file.type
                )
              ) filter (where file.id is not null), '[]') AS files`,
          ),
      ])
      .from(`${this.tableName} as blog`)
      .leftJoin('files as file', function () {
        this.on(knex.raw(`file.depend = '${FileDependentType.blog}'`)).andOn(
          'file.dependent_id',
          'blog.id',
        );
      })
      .where('blog.is_deleted', false)
      .where('blog.status', StatusEnum.ACTIVE)
      .orderBy('blog.created_at', 'desc')
      .groupBy('blog.id');

    if (!isEmpty(params?.search)) {
      query.whereRaw(`(
        blog.title ilike '%${params.search}%'
        or blog.description ilike '%${params.search}%'
        or blog.author ilike '%${params.search}%'
        )`);
    }

    if (limit) {
      query.limit(limit);
      if (offset) {
        query.offset(offset);
      }
    }

    return query;
  }

  getBlogById(id: string) {
    const knex = this.knex;
    return knex
      .select([
        'blog.*',
        knex.raw(
            `COALESCE(
              jsonb_agg(
                jsonb_build_object(
                  'id', file.id,
                  'url', file.url,
                  'type', file.type
                )
              ) filter (where file.id is not null), '[]') AS files`,
          ),
      ])
      .from(this.tableName)
      .leftJoin('files as file', function () {
        this.on(knex.raw(`file.depend = '${FileDependentType.blog}'`)).andOn(
          'file.dependent_id',
          'blog.id',
        );
      })
      .where('id', id)
      .where('is_deleted', false)
      .groupBy('id')
      .first();
  }

  getActiveBlogs(limit = 10) {
    const knex = this.knex;
    return knex
      .select('*')
      .from(this.tableName)
      .where('is_deleted', false)
      .where('status', 1) // Active status
      .orderBy('created_at', 'desc')
      .limit(limit);
  }

  searchBlogs(query: string, limit = 10) {
    const knex = this.knex;
    return knex
      .select('*')
      .from(this.tableName)
      .where('is_deleted', false)
      .where('status', 1) // Active status
      .andWhere(function () {
        this.where('title', 'ilike', `%${query}%`)
          .orWhere('author', 'ilike', `%${query}%`);
      })
      .orderBy('created_at', 'desc')
      .limit(limit);
  }
}