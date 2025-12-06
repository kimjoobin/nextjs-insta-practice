'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { ROUTES } from '@/shared/constants';
import { AiOutlineClose } from 'react-icons/ai';
import { CreatePostForm } from '@/features/post/components/CreatePostForm';

export default function CreatePostPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // 인증 체크
  useEffect(() => {
    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN);
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-instagram-background">
      <Header />
      
      <main className="pt-20 pb-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">새 게시물 만들기</h2>
            <button
              onClick={() => router.back()}
              className="text-instagram-text-light hover:text-instagram-text"
            >
              <AiOutlineClose className="text-2xl" />
            </button>
          </div>

          {/* onSuccess는 useCreatePost에서 이미 라우팅 처리하므로 제거 가능 */}
          <CreatePostForm onCancel={() => router.back()}/>
        </div>
      </main>
    </div>
  );
}
