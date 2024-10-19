// pagination.interface.ts
export interface PaginationParams {
  page?: number;
  page_size?: number;
}

export interface PaginationResult<T> {
  data: T[];
  total_records: number;
  total_pages: number;
  current_page: number;
  page_size: number;
}
