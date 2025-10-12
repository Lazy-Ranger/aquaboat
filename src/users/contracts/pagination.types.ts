export interface IOffsetPaginationResult<T> {
  data: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalRecords: number;
}
