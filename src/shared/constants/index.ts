export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  SIGNUP: '/api/auth/signup',
  LOGOUT: '/api/auth/logout',
  
  // Post
  POSTS: '/api/posts',
  POST_DETAIL: (postSeq: string) => `/api/posts/${postSeq}`,
  
  // User
  USER_PROFILE: (userSeq: string) => `/api/users/${userSeq}`,
  USER_POSTS: (userSeq: string) => `/api/users/${userSeq}/posts`,
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_INFO: 'userInfo',
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  CREATE_POST: '/create',
  PROFILE: (username: string) => `/profile/${username}`,
} as const;

export const QUERY_KEYS = {
  POSTS: 'posts',
  POST_DETAIL: (postSeq: string) => ['post', postSeq],
  USER_PROFILE: (userSeq: string) => ['user', userSeq],
  USER_POSTS: (userSeq: string) => ['user', userSeq, 'posts'],
} as const;
