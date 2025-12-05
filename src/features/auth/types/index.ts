export interface User {
  userSeq: string;
  username: string;
  name: string;
  email: string;
  bio: string | null;
  profileImageUrl: string | null;
  followersCount: number;
  followingCount: number;
  postsCount: number;
}

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
