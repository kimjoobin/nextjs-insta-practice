export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  SIGNUP: '/api/auth/signup',
  LOGOUT: '/api/auth/logout',
  REFRESH: '/api/auth/refresh',
  
  // Post
  POSTS: '/api/posts',
  POST_DETAIL: (postSeq: string) => `/api/posts/${postSeq}`,
  POST_CREATE: '/api/posts/create',
  POST_UPDATE: (postSeq: string) => `/api/posts/${postSeq}`,
  USER_POSTS: (userSeq: string) => `/api/posts/user/${userSeq}`,
  
  // User
  MY_PROFILE: '/api/users/me',
  USER_PROFILE: (userSeq: string) => `/api/users/${userSeq}`,
  MY_POSTS: '/api/posts/my/feed',
  USER_UPDATE: '/api/users/me',
  MY_FOLLOWER: '/api/users/followers',
  MY_FOLLOWING: '/api/users/following',
  USER_SEARCH: '/api/users/search',

  // following
  FOLLOW: (userSeq: string) => `/api/follow/${userSeq}`,
  UNFOLLOW: (userSeq: string) => `/api/follow/${userSeq}/unfollow`,
  USER_FOLLOWERS: (userSeq: string) => `/api/follow/${userSeq}/followers`,
  USER_FOLLOWING: (userSeq: string) => `/api/follow/${userSeq}/following`,
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_INFO: 'userInfo',
  AUTH_STORAGE: 'auth-storage',   // Zustand persist key
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  CREATE_POST: '/create',
  POST_DETAIL: (postSeq: string) => `/post/${postSeq}`,
  PROFILE: (username: string) => `/profile/${username}`,
  EDIT_PROFILE: '/profile/edit',
  MESSAGES: '/messages',
  EXPLORE: '/explore',
  NOTIFICATIONS: '/notifications',
} as const;

export const QUERY_KEYS = {
  // Posts
  POSTS: ['posts'],
  POST_DETAIL: (postSeq: string) => ['post', postSeq] as const,
  POST_COMMENTS: (postSeq: string) => ['post', postSeq, 'comments'] as const,
  
  // Users
  USER_PROFILE: (userSeq: string) => ['user', userSeq] as const,
  USER_POSTS: (userSeq: string) => ['user', userSeq, 'posts'] as const,
  USER_FOLLOWERS: (userSeq: string) => ['user', userSeq, 'followers'] as const,
  USER_FOLLOWING: (userSeq: string) => ['user', userSeq, 'following'] as const,
  
  // Auth
  CURRENT_USER: ['currentUser'] as const,
} as const;

// 페이지네이션 기본값
export const PAGINATION = {
  DEFAULT_PAGE: 0,
  DEFAULT_SIZE: 10,
  FEED_SIZE: 10,
  COMMENT_SIZE: 20,
} as const;

// 파일 업로드 제한
export const FILE_CONSTRAINTS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_FILES_COUNT: 10,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/quicktime'],
} as const;

// 메시지
export const MESSAGES = {
  ERROR: {
    NETWORK: '네트워크 오류가 발생했습니다.',
    UNAUTHORIZED: '로그인이 필요합니다.',
    FORBIDDEN: '권한이 없습니다.',
    NOT_FOUND: '요청한 리소스를 찾을 수 없습니다.',
    SERVER: '서버 오류가 발생했습니다.',
    FILE_SIZE: '파일 크기는 10MB 이하여야 합니다.',
    FILE_TYPE: '이미지 파일만 업로드 가능합니다.',
    FILE_COUNT: '최대 10개까지 업로드 가능합니다.',
  },
  SUCCESS: {
    POST_CREATED: '게시물이 등록되었습니다.',
    POST_UPDATED: '게시물이 수정되었습니다.',
    POST_DELETED: '게시물이 삭제되었습니다.',
    COMMENT_CREATED: '댓글이 등록되었습니다.',
    COMMENT_DELETED: '댓글이 삭제되었습니다.',
    PROFILE_UPDATED: '프로필이 수정되었습니다.',
  },
} as const;

// HTTP 상태 코드
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// 정규식
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  USERNAME: /^[a-zA-Z0-9._]{3,20}$/,
  PASSWORD: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*]{8,}$/,
} as const;