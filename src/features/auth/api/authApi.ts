import { apiClient } from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/constants';
import { ApiResponse } from '@/types/common';
import type { LoginRequest, SignupRequest, AuthResponse } from '../types';

export const authApi = {
  // 로그인
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.LOGIN,
      data
    );
    
    return response.data;
  },

  // 회원가입
  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.SIGNUP,
      data
    );
    return response.data;
  },

  // 로그아웃
  logout: async (): Promise<void> => {
    await apiClient.post<ApiResponse<null>>(API_ENDPOINTS.LOGOUT);
  },
};
