import { BaseRepo } from '@shared/providers/base-dao';
import { Injectable } from '@nestjs/common';
import { TourEntity } from 'src/travel/shared/repo/entity';
import { ITourSeachByName } from 'src/travel/admin/interface/tour.interface';
import { ILanguage, PaginationParams } from '../interfaces';
import { FileDependentType } from '../enums';
import { IGetTourListClient } from 'src/travel/client/interface/tour.interface';

@Injectable()
export class TourRepo extends BaseRepo<TourEntity> {
  constructor() {
    super('tours');
  }

  getAllTours(params: PaginationParams) {
    const knex = this.knex;
    const { offset = 0, limit = 10 } = params;

    const query = knex
      .select(['tour.*', knex.raw('count(tour.id) over() as total')])
      .from(`${this.tableName} as tour`)
      .where('tour.is_deleted', false);

    if (params?.search) {
      query.whereRaw(`make_multilingual_tsvector(tour.title) @@ 
        (
          plainto_tsquery('english', '${params.search}') ||
          plainto_tsquery('russian', '${params.search}') ||
          plainto_tsquery('simple', '${params.search}')
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
  getAllToursClient(params: IGetTourListClient, lang: ILanguage) {
    const knex = this.knex;
    const { offset = 0, limit = 10 } = params;

    const query = knex
      .select([
        'tour.*',
        knex.raw('count(tour.id) over() as total'),
        knex.raw(`tour.title -> '${lang}' as title`),
        knex.raw(`tour.description -> '${lang}' as description`),
        knex.raw(`org.title -> '${lang}' as organizer_title`),
        knex.raw('count(review.id) as review_count'),
        knex.raw(
          `jsonb_agg(
              jsonb_build_object(
                'url', file.url,
                'type', file.type
              )
            ) FILTER (WHERE file.id is not null) AS files`,
        ),
      ])
      .from(`${this.tableName} as tour`)
      .join('organizers as org', function () {
        this.on('org.id', 'tour.organizer_id').andOn(
          knex.raw('org.is_deleted = false'),
        );
      })
      .leftJoin('reviews as review', function () {
        this.on('tour.id', 'review.tour_id').andOn(
          knex.raw('review.is_deleted = false'),
        );
      })
      .leftJoin('files as file', function () {
        this.on('file.dependent_id', 'tour.id').andOn(
          knex.raw('file.depend = ?', FileDependentType.tour),
        );
      })
      .where('tour.is_deleted', false)
      .groupBy(['tour.id', 'org.title']);

    if (params?.search) {
      query.whereRaw(`make_multilingual_tsvector(tour.title) @@ 
        (
          plainto_tsquery('english', '${params.search}') ||
          plainto_tsquery('russian', '${params.search}') ||
          plainto_tsquery('simple', '${params.search}')
        )`);
    }

    if (params?.from_date) {
      query.where('tour.start_date', '>=', params.from_date);
    }

    if (params?.to_date) {
      query.where('tour.end_date', '<=', params.to_date);
    }

    if (params?.from_price) {
      query.where('tour.price', '>=', params.from_price);
    }

    if (params?.to_price) {
      query.where('tour.price', '<=', params.to_price);
    }

    if (params?.location) {
      query.where('tour.location', params.location);
    }

    if (limit) {
      query.limit(limit);
      if (offset) {
        query.offset(offset);
      }
    }

    return query;
  }

  searchTour(params: ITourSeachByName & PaginationParams) {
    const { offset = 0, limit = 10 } = params;

    const knex = this.knex;

    const query = knex
      .select([
        'tour.id',
        'tour.price',
        'tour.sale_price',
        'tour.title',
        'tour.duration',
        'tour.start_date',
        'tour.end_date',
        'tour.seats',
        'tour.rating',
        knex.raw(`jsonb_build_object(
            'id', org.id,
            'title', org.title
          ) as organizer`),
        knex.raw('count(tour.id) over() as total'),
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
      .from(`${this.tableName} as tour`)
      .leftJoin('files as file', function () {
        this.on(knex.raw(`file.depend = '${FileDependentType.tour}'`)).andOn(
          'file.dependent_id',
          'tour.id',
        );
      })
      .leftJoin('organizers as org', function () {
        this.on('tour.organizer_id', 'org.id');
      })
      .where('tour.is_deleted', false)
      .groupBy(['tour.id', 'org.id']);

    if (params?.keyword) {
      query.whereRaw(`make_multilingual_tsvector(tour.title) @@ 
        (
          plainto_tsquery('english', '${params.keyword}') ||
          plainto_tsquery('russian', '${params.keyword}') ||
          plainto_tsquery('simple', '${params.keyword}')
        )`);
    }

    if (params?.location) {
      query.where('tour.location', params.location);
    }

    if (params?.from_price) {
      query.whereRaw('COALESCE(tour.sale_price, tour.price) >= :price', {
        price: params.from_price,
      });
    }

    if (params?.to_price) {
      query.whereRaw('COALESCE(tour.sale_price, tour.price) <= :price', {
        price: params.to_price,
      });
    }

    if (params?.from_date) {
      query.where('tour.start_date', '>=', params.from_date);
    }

    if (params?.to_date) {
      query.where('tour.end_date', '<=', params.to_date);
    }

    if (params?.seats) {
      query.where('tour.seats', '>=', params.seats);
    }

    if (limit) {
      query.limit(limit);
      if (offset) {
        query.offset(offset);
      }
    }

    return query;
  }
}
