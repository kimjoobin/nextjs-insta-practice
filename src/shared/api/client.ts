import { ENV } from '@/config/env';
import { STORAGE_KEYS, ROUTES } from '@/shared/constants';

interface RequestConfig extends RequestInit {
  params?: Record<string, string>;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getToken(): string | null {
    // SSR 환경(Next.js 서버)에서는 브라우저 API 접근 불가
    if (typeof window === 'undefined') return null;

    // 1순위: 브라우저 쿠키에서 먼저 찾기 (Zustand 하이드레이션 지연과 무관하게 즉시 접근 가능)
    try {
      // 참고: useAuthStore에서 'accessToken='으로 굽고 있으므로 해당 키값 매칭
      // 만약 STORAGE_KEYS.ACCESS_TOKEN의 값이 'accessToken'과 다르다면 수정이 필요합니다.
      const match = document.cookie
        .split('; ')
        .find(row => row.startsWith(`accessToken=`)); 
        
      if (match) {
        return match.split('=')[1];
      }
    } catch (error) {
      console.warn('쿠키에서 토큰을 읽는 중 에러 발생:', error);
    }

    // 2순위: localStorage (Zustand persist - 쿠키가 날아갔거나 만료된 경우 대비)
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_INFO);
      if (stored) {
        const parsed = JSON.parse(stored);
        const token = parsed.state?.accessToken;
        if (token) return token;
      }
    } catch (error) {
      console.warn('localStorage에서 토큰을 읽는 중 에러 발생:', error);
    }

    return null; // 둘 다 없으면 null
  }

  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const { params, headers, ...restConfig } = config;

    // URL 생성
    let url = `${this.baseURL}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }

    // 헤더 설정
    const token = this.getToken();

    // 🔥 FormData 체크 - body는 restConfig에 포함됨
    // FormData는 브라우저가 boundary와 함께 자동으로 설정함
    const isFormData = restConfig.body instanceof FormData;

    const defaultHeaders: HeadersInit = {};

    // FormData가 아닐 때만 Content-Type 설정
    if (!isFormData) {
      defaultHeaders['Content-Type'] = 'application/json';
    }

    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
      console.log('✅ Authorization 헤더 추가');
    } else {
      console.log('❌ 토큰 없음!');
    }

    // 요청
    try {
      const response = await fetch(url, {
        ...restConfig,
        credentials: 'include',
        headers: {
          ...defaultHeaders,
          ...headers,
        },
      });

      // 401 에러 처리
      if (response.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(STORAGE_KEYS.USER_INFO);
          window.location.href = ROUTES.LOGIN;
        }
        throw new Error('인증이 만료되었습니다.');
      }

      // 에러 응답 처리
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(ENV.API_URL);
export default apiClient;
