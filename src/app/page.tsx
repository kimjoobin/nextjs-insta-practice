'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { PostCard } from '@/features/post/components/PostCard';
import { Button } from '@/components/common/Button';
import { usePosts } from '@/features/post/hooks/usePost';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { ROUTES } from '@/shared/constants';

export default function HomePage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { data: posts, isLoading, error } = usePosts();

  // 인증 체크
  useEffect(() => {
    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN);
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-instagram-background">
        <Header />
        <main className="pt-20 pb-8">
          <div className="max-w-2xl mx-auto px-4">
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-instagram-blue"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-instagram-background">
      <Header />
      
      <main className="pt-20 pb-8">
        <div className="max-w-2xl mx-auto px-4">
          {/* 스토리 섹션 */}
          <div className="bg-white border border-instagram-border rounded-lg mb-6 p-4 overflow-x-auto">
            <div className="flex gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-tr from-yellow-400 to-pink-600 rounded-full p-[2px]">
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                      <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-xs">User{i}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs">user{i}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 피드 목록 */}
          {error && (
            <div className="bg-white border border-instagram-border rounded-lg p-6 text-center mb-6">
              <p className="text-red-500">피드를 불러오는데 실패했습니다.</p>
            </div>
          )}

          {posts && posts.length === 0 ? (
            <div className="bg-white border border-instagram-border rounded-lg p-12 text-center">
              <p className="text-instagram-text-light mb-4">아직 게시물이 없습니다.</p>
              <Button
                onClick={() => router.push(ROUTES.CREATE_POST)}
                variant="primary"
              >
                첫 게시물 만들기
              </Button>
            </div>
          ) : (
            <div>
              {posts?.map((post) => (
                <PostCard key={post.postSeq} post={post} />
              ))}
            </div>
          )}

          {/* 더 보기 */}
          {posts && posts.length > 0 && (
            <div className="text-center py-8">
              <p className="text-instagram-text-light text-sm">모든 게시물을 확인했습니다</p>
            </div>
          )}
        </div>

        {/* 사이드바 (데스크톱) */}
        <aside className="hidden lg:block fixed right-8 top-24 w-80">
          <div className="space-y-4">
            {/* 프로필 정보 */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold">나</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">내 계정</p>
                <p className="text-instagram-text-light text-sm">내 이름</p>
              </div>
              <button className="text-instagram-blue text-xs font-semibold">
                전환
              </button>
            </div>

            {/* 추천 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-instagram-text-light font-semibold text-sm">
                  회원님을 위한 추천
                </p>
                <button className="text-xs font-semibold">모두 보기</button>
              </div>

              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-xs">U{i}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">user{i}</p>
                      <p className="text-instagram-text-light text-xs">
                        회원님을 위한 추천
                      </p>
                    </div>
                    <button className="text-instagram-blue text-xs font-semibold">
                      팔로우
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 푸터 */}
            <div className="text-xs text-instagram-text-light space-y-3 pt-6">
              <div className="flex flex-wrap gap-x-2 gap-y-1">
                <a href="#" className="hover:underline">소개</a>
                <span>·</span>
                <a href="#" className="hover:underline">도움말</a>
                <span>·</span>
                <a href="#" className="hover:underline">API</a>
                <span>·</span>
                <a href="#" className="hover:underline">개인정보처리방침</a>
              </div>
              <p>© 2025 INSTAGRAM CLONE</p>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
