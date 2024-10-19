// pagination.helper.ts
import {
  PaginationParams,
  PaginationResult,
} from '@shared/interfaces/pagination';
import { Knex } from 'knex';

export async function paginate<T>(
  queryBuilder: Knex.QueryBuilder,
  paginationParams: PaginationParams,
): Promise<PaginationResult<T>> {
  const page = paginationParams.page || 1;
  const pageSize = paginationParams.page_size || 10;

  // Clone the query builder to get the total count without limit and offset
  const totalQuery = queryBuilder
    .clone()
    .clearSelect()
    .clearOrder()
    .count({ total: '*' })
    .first();
  const totalResult = await totalQuery;
  const totalRecords = parseInt(totalResult.total, 10);

  // Apply pagination to the original query
  const data = await queryBuilder.offset((page - 1) * pageSize).limit(pageSize);

  const totalPages = Math.ceil(totalRecords / pageSize);

  return {
    data,
    total_records: totalRecords,
    total_pages: totalPages,
    current_page: page,
    page_size: pageSize,
  };
}
