import { apiClient } from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/constants';
import { ApiResponse } from '@/types/common';
import type { Post, CreatePostRequest, UpdatePostRequest } from '../types';

export const postApi = {
  // 피드 목록 조회
  getPosts: async (): Promise<Post[]> => {
    const response = await apiClient.get<ApiResponse<Post[]>>(
      API_ENDPOINTS.POSTS
    );
    return response.data.content;
  },

  // 피드 상세 조회
  getPost: async (postSeq: string): Promise<Post> => {
    const response = await apiClient.get<ApiResponse<Post>>(
      API_ENDPOINTS.POST_DETAIL(postSeq)
    );
    return response.data;
  },

  // 피드 등록
  createPost: async (data: CreatePostRequest, files: File[]): Promise<Post> => {
    const formData = new FormData();
    
    // JSON 데이터를 Blob으로 변환
    const requestBlob = new Blob([JSON.stringify(data)], {
      type: 'application/json',
    });
    formData.append('request', requestBlob);
    
    // 파일 추가
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await apiClient.post<ApiResponse<Post>>(
      API_ENDPOINTS.POSTS,
      formData
    );
    return response.data;
  },

  // 피드 수정
  updatePost: async (postSeq: string, data: UpdatePostRequest): Promise<Post> => {
    const response = await apiClient.patch<ApiResponse<Post>>(
      API_ENDPOINTS.POST_DETAIL(postSeq),
      data
    );
    return response.data;
  },

  // 피드 삭제
  deletePost: async (postSeq: string): Promise<void> => {
    await apiClient.delete<ApiResponse<null>>(
      API_ENDPOINTS.POST_DETAIL(postSeq)
    );
  },

  // 좋아요 토글
  toggleLike: async (postSeq: string): Promise<{ isLiked: boolean }> => {
    const response = await apiClient.post<ApiResponse<{ isLiked: boolean }>>(
      `${API_ENDPOINTS.POST_DETAIL(postSeq)}/like`
    );
    return response.data;
  },
};
