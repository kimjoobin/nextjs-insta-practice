// src/features/post/components/PostCard.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AiOutlineHeart, AiFillHeart, AiOutlineComment } from 'react-icons/ai';
import { BsBookmark } from 'react-icons/bs';
import { useToggleLike } from '@/features/post/hooks/usePost';
import { formatDate, getImageUrl } from '@/shared/utils';
import type { Post } from '@/features/post/types';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { mutate: toggleLike } = useToggleLike();

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? post.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => 
      prev === post.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="bg-white border rounded-lg mb-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          {post.user?.profileImageUrl ? (
            <Image
              src={getImageUrl(post.user?.profileImageUrl)}
              alt={post.user?.username}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <div className="w-8 h-8 bg-gray-300 rounded-full" />
          )}
          <div>
            <p className="font-semibold text-sm">{post.user?.username || "Unknwon user"}</p>
            {post.location && (
              <p className="text-xs text-gray-500">{post.location}</p>
            )}
          </div>
        </div>
      </div>

      {/* 이미지 슬라이더 */}
      <div className="relative w-full aspect-square bg-gray-100">
        <Image
          src={getImageUrl(post.images[currentImageIndex])}
          alt={`Post image ${currentImageIndex + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 600px"
        />

        {/* 이전/다음 버튼 (이미지가 2개 이상일 때만) */}
        {post.images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2"
            >
              ‹
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2"
            >
              ›
            </button>

            {/* 인디케이터 */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
              {post.images.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full ${
                    index === currentImageIndex ? 'bg-blue-500' : 'bg-white/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* 액션 버튼 */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-4">
            <button onClick={() => toggleLike(post.postSeq)}>
              {post.likeCount > 0 ? (
                <AiFillHeart className="text-red-500 text-2xl" />
              ) : (
                <AiOutlineHeart className="text-2xl" />
              )}
            </button>
            <button>
              <AiOutlineComment className="text-2xl" />
            </button>
          </div>
          <button>
            <BsBookmark className="text-xl" />
          </button>
        </div>

        {/* 좋아요 수 */}
        <p className="font-semibold text-sm mb-2">좋아요 {post.likeCount}개</p>

        {/* 본문 */}
        {post.caption && (
          <p className="text-sm mb-2">
            <span className="font-semibold mr-2">{post.user?.username || 'Unknown'}</span>
            {post.caption}
          </p>
        )}

        {/* 댓글 수 */}
        {post.commentCount > 0 && (
          <p className="text-gray-500 text-sm mb-2">
            댓글 {post.commentCount}개 모두 보기
          </p>
        )}

        {/* 작성 시간 */}
        <p className="text-gray-400 text-xs">{formatDate(post.createdAt)}</p>
      </div>
    </div>
  );
}