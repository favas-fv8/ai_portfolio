/** Standard API response envelope */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  status_code?: number;
  errors?: Record<string, string | string[]>;
}

/** Paginated list response from DRF */
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
