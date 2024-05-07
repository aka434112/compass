export interface IPaginatedResponse<T> {
  total_count: number
  results: T[]
  page: number
  page_size: number
}
