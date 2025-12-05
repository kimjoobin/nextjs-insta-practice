'use client';

import Image from 'next/image';
import { AiOutlineHeart, AiFillHeart, AiOutlineComment, AiOutlineSend } from 'react-icons/ai';
import { BsBookmark, BsThreeDots } from 'react-icons/bs';
import { useToggleLike } from '@/features/post/hooks/usePost';
import { formatDate } from '@/shared/utils';
import type { Post } from '@/features/post/types';

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
  const { mutate: toggleLike } = useToggleLike(post.postSeq);

  const handleLike = () => {
    toggleLike();
  };

  return (
    <article className="bg-white border border-instagram-border rounded-lg mb-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-yellow-400 to-pink-600 rounded-full p-[2px]">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
              {post.user?.profileImageUrl ? (
                <Image
                  src={post.user.profileImageUrl}
                  alt={post.user.username}
                  width={36}
                  height={36}
                  className="rounded-full"
                />
              ) : (
                <span className="text-xs font-semibold">
                  {post.user?.username[0]?.toUpperCase() || '?'}
                </span>
              )}
            </div>
          </div>
          <div>
            <p className="font-semibold text-sm">{post.user?.username || 'Unknown'}</p>
            {post.location && (
              <p className="text-xs text-instagram-text-light">{post.location}</p>
            )}
          </div>
        </div>
        <button className="hover:text-gray-600">
          <BsThreeDots className="text-xl" />
        </button>
      </div>

      {/* 이미지 */}
      <div className="relative w-full aspect-square bg-gray-100">
        <Image
          src={post.imageUrl}
          alt={post.caption || 'Post image'}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 600px"
        />
      </div>

      {/* 액션 버튼 */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button onClick={handleLike} className="hover:text-gray-600 transition">
              {post.isLiked ? (
                <AiFillHeart className="text-2xl text-red-500" />
              ) : (
                <AiOutlineHeart className="text-2xl" />
              )}
            </button>
            <button className="hover:text-gray-600 transition">
              <AiOutlineComment className="text-2xl" />
            </button>
            <button className="hover:text-gray-600 transition">
              <AiOutlineSend className="text-2xl" />
            </button>
          </div>
          <button className="hover:text-gray-600 transition">
            <BsBookmark className="text-xl" />
          </button>
        </div>

        {/* 좋아요 수 */}
        <p className="font-semibold text-sm mb-2">좋아요 {post.likeCount}개</p>

        {/* 캡션 */}
        {post.caption && (
          <div className="text-sm mb-2">
            <span className="font-semibold mr-2">{post.user?.username || 'Unknown'}</span>
            <span>{post.caption}</span>
          </div>
        )}

        {/* 댓글 수 */}
        {post.commentCount > 0 && (
          <button className="text-sm text-instagram-text-light mb-2">
            댓글 {post.commentCount}개 모두 보기
          </button>
        )}

        {/* 시간 */}
        <p className="text-xs text-instagram-text-light">{formatDate(post.createdAt)}</p>
      </div>

      {/* 댓글 입력 */}
      <div className="border-t border-instagram-border p-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="댓글 달기..."
            className="flex-1 text-sm focus:outline-none"
          />
          <button className="text-instagram-blue font-semibold text-sm">게시</button>
        </div>
      </div>
    </article>
  );
};
