// API 공통 응답 타입
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
}

export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// 공통 엔티티 타입
export interface BaseEntity {
  createdAt: string;
  updatedAt: string;
}

// 에러 타입
export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}
