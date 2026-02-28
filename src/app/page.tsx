'use client';

import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import PostCard from '@/features/post/components/PostCard';
import { Button } from '@/components/common/Button';
import { usePosts } from '@/features/post/hooks/usePost';
import { ROUTES } from '@/shared/constants';
import AuthGuard from '@/shared/components/AuthGuard'; // 🔥 중괄호 없이 import

export default function HomePage() {
  const router = useRouter();
  const { data: postsData, isLoading, error } = usePosts();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-instagram-background">
        <Header />
        
        <main className="pt-20 pb-8">
          <div className="max-w-2xl mx-auto px-4">
            
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-instagram-blue"></div>
              </div>
            ) : (
              <>
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

                {/* 에러 발생 시 */}
                {error && (
                  <div className="bg-white border border-instagram-border rounded-lg p-6 text-center mb-6">
                    <p className="text-red-500">피드를 불러오는데 실패했습니다.</p>
                  </div>
                )}

                {/* 피드 목록 */}
                {!error && (!postsData?.content || postsData.content.length === 0) ? (
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
                    {postsData?.content?.map((post) => (
                      <PostCard key={post.postSeq} post={post} />
                    ))}
                  </div>
                )}

                {/* 더 보기 */}
                {postsData?.content && postsData.content.length > 0 && (
                  <div className="text-center py-8">
                    <p className="text-instagram-text-light text-sm">모든 게시물을 확인했습니다</p>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}