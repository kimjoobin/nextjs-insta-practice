import { BaseEntity } from '@/types/common';

export interface Post extends BaseEntity {
  postSeq: string;
  caption: string | null;
  imageUrl: string;
  location: string | null;
  likeCount: number;
  commentCount: number;
  isLiked?: boolean;
  user?: PostUser;
}

export interface PostUser {
  userSeq: string;
  username: string;
  name: string;
  profileImageUrl: string | null;
}

export interface CreatePostRequest {
  caption?: string;
  location?: string;
}

export interface UpdatePostRequest {
  caption?: string;
  location?: string;
}

export interface PostListResponse {
  posts: Post[];
  hasNext: boolean;
  nextCursor?: string;
}

// 🔥 Spring Page 응답 타입 추가
export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  lastPage: boolean;
  firstPage: boolean;
}