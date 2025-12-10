export interface IOffsetPaginationResult<T> {
  data: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalRecords: number;
}

export interface IUserSearchParams {
  page?: number;
  limit?: number;
  filter?: string; // JSON stringified IUserSearchFilter
}
