import {useMutation, useQueryClient} from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../stores/authStore';
import { ROUTES } from '@/shared/constants';
import type { LoginRequest, SignupRequest } from '../types';
import {userApi} from "@/features/user/api/userApi";

// 로그인 Hook
export const useLogin = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      // 로그인
      const loginResponse = await authApi.login(credentials);
      const { accessToken } = loginResponse;

      // 토큰을 쿠키에 임시 저장(API 호출용)
      if (typeof window !== 'undefined') {
        document.cookie = `accessToken=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
      }

      // 사용자 정보 조회
      const user = await userApi.getMyProfile();

      return { accessToken, user };
    },
    onSuccess: ({accessToken, user}) => {
      setAuth(user, accessToken);
      router.push(ROUTES.HOME);
    },
  });
};

// 회원가입 Hook
export const useSignup = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (data: SignupRequest) => {
      // 회원가입
      const signupResponse = await authApi.signup(data);
      const {accessToken} = signupResponse;

      // 토큰을 쿠키에 임시 저장
      if (typeof window !== 'undefined') {
        document.cookie = `accessToken=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
      }

      // 사용자 정보 조회
      const user = await userApi.getMyProfile();

      return { accessToken, user };
    },
    onSuccess: ({ accessToken, user }) => {
      // Zustand에 저장
      setAuth(user, accessToken);
      router.push(ROUTES.HOME);
    },
    onError: (error: any) => {
      console.error('회원가입 실패:', error);
      if (typeof window !== 'undefined') {
        document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
    },
  });
};

// 로그아웃 Hook
export const useLogout = () => {
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear(); // 모든 쿼리 캐시 삭제
      router.push(ROUTES.LOGIN);
    },
    onError: () => {
      // 에러가 나도 로컬 상태는 클리어
      clearAuth();
      router.push(ROUTES.LOGIN);
    },
  });
};
