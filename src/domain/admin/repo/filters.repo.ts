import { BaseRepo } from '@shared/providers/base-dao';
import { Injectable } from '@nestjs/common';
import { FiltersEntity, FilterValuesEntity } from '../entity/filters.entity';
import { ProductFiltersEntity } from '../entity/product.entity';
import { IdeasFiltersEntity } from '../entity/ideas.entity';

@Injectable()
export class FiltersRepo extends BaseRepo<FiltersEntity> {
  constructor() {
    super('filters');
  }

  getAllFilters() {
    const knex = this.knex;
    return knex
      .select(['filter.*', knex.raw(`array_agg(to_json(fv.*)) as values`)])
      .from(`${this.tableName} as filter`)
      .join('filter_values as fv', function () {
        this.on('filter.id', 'fv.filter_id');
      })
      .groupBy('filter.id');
  }
}

@Injectable()
export class FilterValuesRepo extends BaseRepo<FilterValuesEntity> {
  constructor() {
    super('filter_values');
  }

  getAllFilterValues() {
    return this.getAll({ is_deleted: false });
  }
}

@Injectable()
export class ProductFiltersRepo extends BaseRepo<ProductFiltersEntity> {
  constructor() {
    super('product_filters');
  }

  getAllProductFilters() {
    return this.getAll({ is_deleted: false });
  }
}

@Injectable()
export class IdeasFiltersRepo extends BaseRepo<IdeasFiltersEntity> {
  constructor() {
    super('idea_filters');
  }

  getAllIdeasFilters() {
    return this.getAll({ is_deleted: false });
  }
}
