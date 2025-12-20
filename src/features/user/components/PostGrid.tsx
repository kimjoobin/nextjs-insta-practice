'use client';

import {Post} from "@/features/post/types";
import {useState} from "react";
import {AiFillHeart, AiOutlineComment} from "react-icons/ai";
import Image from 'next/image';
import {PostDetailModal} from "@/features/user/components/PostDetailModel";

interface PostGridProps {
    posts: Post[];
    isLoading: boolean;
}

export const PostGrid = ({
                             posts,
                             isLoading
                         }: PostGridProps) => {

    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    if (isLoading) {
        return (
            <div className="grid grid-cols-3 gap-1 md:gap-7">
                {[...Array(12)].map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-200 animate-pulse"/>
                ))}
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="w-20 h-20 rounded-full border-2 border-black flex items-center justify-center mb-4">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                    </svg>
                </div>
                <h2 className="text-2xl font-light mb-2">게시물 없음</h2>
                <p className="text-gray-500">아직 게시물이 없습니다</p>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-3 gap-1 md:gap-7">
                {posts.map((post) => (
                    <button
                        key={post.postSeq}
                        onClick={() => setSelectedPost(post)}
                        className="relative aspect-square group overflow-hidden bg-gray-100"
                    >
                        <Image
                            src={post.images[0] || '/placeholder.png'}
                            alt="게시물"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 33vw, 300px"
                        />

                        {/* 호버 오버레이 */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="flex items-center gap-6 text-white font-semibold">
                                <div className="flex items-center gap-2">
                                    <AiFillHeart className="text-2xl" />
                                    <span>{post.likeCount}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <AiOutlineComment className="text-2xl" />
                                    <span>{post.commentCount}</span>
                                </div>
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {/* 게시물 상세 모달 */}
            {selectedPost && (
                <PostDetailModal
                    post={selectedPost}
                    onClose={() => setSelectedPost(null)}
                />
            )}
        </>
    );
};