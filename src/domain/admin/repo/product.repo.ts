import { BaseRepo } from '@shared/providers/base-dao';
import { Injectable } from '@nestjs/common';
import { ProductEntity } from '../entity/product.entity';

@Injectable()
export class ProductRepo extends BaseRepo<ProductEntity> {
  constructor() {
    super('products');
  }

  getAllProducts() {
    return this.getAll({ is_deleted: false });
  }

  async getProductsByIdea(idea_id: string) {
    const products = this.knex('products as p')
      .distinct('p.*')
      .join('product_filters as pf', 'p.id', 'pf.product_id')
      .join('idea_filters as if', 'pf.filter_value_id', 'if.filter_value_id')
      .where('if.idea_id', idea_id);

    return products;
  }

  async getProductsByCategory(category_id: string) {
    const subquery = this.knex('category')
      .select('parent_hierarchy')
      .where('id', category_id);

    const query = this.knex('product as p')
      .select('p.*')
      .join('category as c', 'p.category_id', 'c.id')
      .whereRaw('c.parent_hierarchy @> (?)', [subquery]);

    return query;
  }
}
