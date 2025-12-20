// User 타입을 user feature에서 import
export type { User, ProfileUser } from '@/features/user/types/user';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  password: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}
