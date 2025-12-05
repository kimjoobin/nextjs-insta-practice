import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../stores/authStore';
import { ROUTES } from '@/shared/constants';
import type { LoginRequest, SignupRequest } from '../types';

// 로그인 Hook
export const useLogin = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      // 임시로 user 데이터 설정 (실제로는 user 정보 API 호출 필요)
      const user = {
        userSeq: response.userSeq,
        username: '',
        name: '',
        email: '',
        bio: null,
        profileImageUrl: null,
        followersCount: 0,
        followingCount: 0,
        postsCount: 0,
      };
      
      setAuth(user, response.accessToken);
      router.push(ROUTES.HOME);
    },
  });
};

// 회원가입 Hook
export const useSignup = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: SignupRequest) => authApi.signup(data),
    onSuccess: () => {
      alert('회원가입이 완료되었습니다!');
      router.push(ROUTES.LOGIN);
    },
  });
};

// 로그아웃 Hook
export const useLogout = () => {
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearAuth();
      router.push(ROUTES.LOGIN);
    },
    onError: () => {
      // 에러가 나도 로컬 상태는 클리어
      clearAuth();
      router.push(ROUTES.LOGIN);
    },
  });
};
