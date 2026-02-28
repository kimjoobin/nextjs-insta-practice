'use client';

import { useState } from 'react';
import Image from 'next/image';
import { BsX, BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { AiFillHeart, AiOutlineHeart, AiOutlineComment } from 'react-icons/ai';
import { usePostDetail } from '@/features/post/hooks/usePost';
import { getImageUrl } from '@/shared/utils';

interface PostDetailModalProps {
    postSeq: string;
    onClose: () => void;
}

export const PostDetailModal = ({ postSeq, onClose }: PostDetailModalProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { data: post, isLoading } = usePostDetail(postSeq);

    const handlePrev = () => setCurrentIndex(prev => prev > 0 ? prev - 1 : post!.images.length - 1);
    const handleNext = () => setCurrentIndex(prev => prev < post!.images.length - 1 ? prev + 1 : 0);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
            onClick={onClose}
        >
            {/* 닫기 버튼 */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white z-10"
            >
                <BsX className="text-4xl" />
            </button>

            <div
                className="relative bg-white flex w-full max-w-5xl max-h-[90vh] mx-4"
                onClick={e => e.stopPropagation()}
            >
                {isLoading || !post ? (
                    <div className="w-full flex items-center justify-center h-96">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
                    </div>
                ) : (
                    <>
                        {/* 왼쪽: 이미지 영역 */}
                        <div className="relative flex-1 bg-black aspect-square">
                            <Image
                                src={getImageUrl(post.images[currentIndex])}
                                alt="게시물"
                                fill
                                className="object-contain"
                            />

                            {/* 이전/다음 버튼 */}
                            {post.images.length > 1 && (
                                <>
                                    <button
                                        onClick={handlePrev}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1.5"
                                    >
                                        <BsChevronLeft />
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1.5"
                                    >
                                        <BsChevronRight />
                                    </button>

                                    {/* 인디케이터 */}
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                                        {post.images.map((_, i) => (
                                            <div
                                                key={i}
                                                className={`w-1.5 h-1.5 rounded-full transition ${
                                                    i === currentIndex ? 'bg-white' : 'bg-white/50'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* 오른쪽: 정보 영역 */}
                        <div className="w-80 flex flex-col border-l border-gray-200">
                            {/* 유저 정보 */}
                            <div className="flex items-center gap-3 p-4 border-b border-gray-200">
                                {post.user?.profileImageUrl ? (
                                    <Image
                                        src={getImageUrl(post.user.profileImageUrl)}
                                        alt={post.user.username}
                                        width={36}
                                        height={36}
                                        className="rounded-full"
                                    />
                                ) : (
                                    <div className="w-9 h-9 rounded-full bg-gray-200" />
                                )}
                                <div>
                                    <p className="font-semibold text-sm">{post.user?.username}</p>
                                    {post.location && (
                                        <p className="text-xs text-gray-500">{post.location}</p>
                                    )}
                                </div>
                            </div>

                            {/* 캡션 */}
                            <div className="flex-1 overflow-y-auto p-4">
                                {post.caption && (
                                    <div className="flex gap-3">
                                        {post.user?.profileImageUrl ? (
                                            <Image
                                                src={getImageUrl(post.user.profileImageUrl)}
                                                alt={post.user.username}
                                                width={32}
                                                height={32}
                                                className="rounded-full flex-shrink-0"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
                                        )}
                                        <div>
                                            <span className="font-semibold text-sm mr-2">{post.user?.username}</span>
                                            <span className="text-sm">{post.caption}</span>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 하단: 좋아요/댓글 수 */}
                            <div className="border-t border-gray-200 p-4">
                                <div className="flex items-center gap-4 mb-2">
                                    <AiOutlineHeart className="text-2xl cursor-pointer" />
                                    <AiOutlineComment className="text-2xl cursor-pointer" />
                                </div>
                                <p className="text-sm font-semibold">좋아요 {post.likeCount}개</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};