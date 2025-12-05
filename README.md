# Instagram Clone - Frontend (실무 구조)

Next.js + TypeScript + Tailwind CSS + React Query + Zustand로 만든 인스타그램 클론 프론트엔드입니다.

## 📁 프로젝트 구조 (실무 지향)

```
instagram-clone-frontend/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # 인증 관련 route group
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── create/                   # 피드 등록
│   │   ├── layout.tsx                # Root Layout
│   │   ├── page.tsx                  # 메인 페이지
│   │   ├── globals.css               # Global Styles
│   │   └── providers.tsx             # React Query Provider
│   │
│   ├── features/                     # Feature 기반 구조
│   │   ├── auth/                     # 인증 기능
│   │   │   ├── api/                  # API 호출 함수
│   │   │   ├── components/           # 인증 관련 컴포넌트
│   │   │   ├── hooks/                # 커스텀 훅
│   │   │   ├── stores/               # Zustand 스토어
│   │   │   └── types/                # 타입 정의
│   │   │
│   │   ├── post/                     # 게시물 기능
│   │   │   ├── api/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── stores/
│   │   │   └── types/
│   │   │
│   │   └── user/                     # 사용자 기능 (예정)
│   │
│   ├── components/                   # 공통 컴포넌트
│   │   ├── common/                   # 재사용 가능한 UI 컴포넌트
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── ...
│   │   └── layout/                   # 레이아웃 컴포넌트
│   │       └── Header.tsx
│   │
│   ├── shared/                       # 공유 리소스
│   │   ├── api/                      # API 클라이언트
│   │   │   └── client.ts             # Axios 인스턴스
│   │   ├── constants/                # 상수
│   │   │   └── index.ts
│   │   ├── hooks/                    # 공통 훅
│   │   ├── stores/                   # 공통 스토어
│   │   └── utils/                    # 유틸리티 함수
│   │       ├── index.ts
│   │       └── cn.ts
│   │
│   ├── types/                        # 글로벌 타입 정의
│   │   └── common.ts
│   │
│   └── config/                       # 설정 파일
│       └── env.ts
│
├── public/                           # 정적 파일
├── .env.local.example                # 환경 변수 예시
├── .gitignore
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── package.json
└── README.md
```

## 🎯 아키텍처 특징

### 1. Feature-Based 구조
- 기능별로 폴더를 구분하여 관심사 분리
- 각 feature는 독립적으로 동작 가능
- `auth/`, `post/`, `user/` 등 도메인 별로 구성

### 2. Shared vs Feature
- **shared**: 여러 feature에서 공통으로 사용하는 리소스
- **features**: 특정 도메인에 종속된 로직

### 3. 상태 관리
- **Zustand**: 전역 상태 관리 (인증, 사용자 정보)
- **React Query**: 서버 상태 관리 (API 데이터, 캐싱)

### 4. API 레이어 분리
- **client.ts**: Axios 인스턴스, 인터셉터
- **{feature}/api/*.ts**: Feature별 API 함수
- **{feature}/hooks/*.ts**: React Query 래핑

### 5. 타입 안정성
- Feature별 타입 정의
- 공통 타입은 `types/common.ts`에 정의
- API 응답 타입 명시

## 🚀 시작하기

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
```bash
cp .env.local.example .env.local
```

```.env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 3. 개발 서버 실행
```bash
npm run dev
```

## 🛠 기술 스택

### Core
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**

### 상태 관리
- **React Query** - 서버 상태 관리, 캐싱
- **Zustand** - 전역 클라이언트 상태 관리

### HTTP Client
- **Axios** - API 통신
- **js-cookie** - 쿠키 관리

### UI
- **React Icons** - 아이콘
- **clsx** - 클래스네임 유틸리티

## 📱 주요 기능

### ✅ 구현 완료
- 로그인 / 회원가입
- JWT 토큰 기반 인증
- 피드 목록 조회 (React Query 캐싱)
- 피드 등록 (이미지 업로드)
- 좋아요 기능 (Optimistic Update)
- 반응형 디자인

### 🚧 개발 예정
- 댓글 기능
- 팔로우/언팔로우
- 프로필 페이지
- 무한 스크롤
- 이미지 다중 업로드
- 스토리 기능

## 🔑 주요 패턴

### 1. Custom Hooks
```typescript
// features/auth/hooks/useAuth.ts
export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  
  return useMutation({
    mutationFn: (data) => authApi.login(data),
    onSuccess: (response) => {
      setAuth(user, response.accessToken);
    },
  });
};
```

### 2. API 레이어
```typescript
// features/post/api/postApi.ts
export const postApi = {
  getPosts: async () => {
    const response = await apiClient.get('/api/posts');
    return response.data.data;
  },
};
```

### 3. Zustand Store
```typescript
// features/auth/stores/authStore.ts
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setAuth: (user, accessToken) => {
        Cookies.set('accessToken', accessToken);
        set({ user, isAuthenticated: true });
      },
    }),
    { name: 'userInfo' }
  )
);
```

### 4. React Query
```typescript
// features/post/hooks/usePost.ts
export const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: () => postApi.getPosts(),
    staleTime: 1000 * 60 * 5, // 5분
  });
};
```

## 📝 개발 가이드

### 새 Feature 추가 시
1. `src/features/{feature-name}/` 디렉토리 생성
2. `api/`, `components/`, `hooks/`, `stores/`, `types/` 서브 디렉토리 생성
3. API 함수 작성 → Hook 작성 → 컴포넌트 작성 순서로 개발

### 공통 컴포넌트 추가 시
1. `src/components/common/` 에 추가
2. 재사용 가능하고 도메인 로직이 없어야 함
3. Props 타입 명시

### API 엔드포인트 추가 시
1. `src/shared/constants/index.ts`에 엔드포인트 추가
2. Feature별 API 파일에서 사용

## 🎨 코드 컨벤션

- **파일명**: PascalCase (컴포넌트), camelCase (유틸, 훅)
- **컴포넌트**: Named Export 사용
- **타입**: Interface 우선, Type은 필요시
- **스타일**: Tailwind CSS 유틸리티 클래스

## 🔐 환경 변수

| 변수 | 설명 | 기본값 |
|------|------|--------|
| NEXT_PUBLIC_API_URL | 백엔드 API URL | http://localhost:8080 |
| NODE_ENV | 환경 | development |

## 📄 라이선스

이 프로젝트는 학습 목적으로 만들어졌습니다.
