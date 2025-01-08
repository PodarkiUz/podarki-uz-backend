import { BaseRepo } from '@shared/providers/base-dao';
import { Injectable } from '@nestjs/common';
import { IdeasEntity } from '../entity/ideas.entity';

@Injectable()
export class IdeasRepo extends BaseRepo<IdeasEntity> {
  constructor() {
    super('ideas');
  }

  getAllIdeas() {
    const knex = this.knex;
    return this.knex
      .select([
        'idea.*',
        knex.raw(`
          json_build_object(
            'id', ig.id,
            'name_uz', ig.name_uz,
            'name_ru', ig.name_ru
          ) as idea_group
        `),
      ])
      .from(`${this.tableName} as idea`)
      .leftJoin('idea_group as ig', function () {
        this.on('ig.id', 'idea.group_id').andOn(
          knex.raw('ig.is_deleted = false'),
        );
      })
      .where('idea.is_deleted', false);
  }
}
