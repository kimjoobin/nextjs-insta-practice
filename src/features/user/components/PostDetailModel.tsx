'use client';

import {Post} from "@/features/post/types";
import {BsX} from "react-icons/bs";
import Image from 'next/image';

interface PostDetailModelProps {
    post: Post,
    onClose: () => void;
}

export const PostDetailModal = ({ post, onClose }: PostDetailModelProps) => {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
            onClick={onClose}
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
                <BsX className="text-4xl" />
            </button>

            <div
                className="relative max-w-5xl max-h-[90vh] w-full mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-white flex flex-col md:flex-row max-h-[90vh]">
                    {/* 이미지 */}
                    <div className="flex-1 bg-black flex items-center justify-center">
                        <div className="relative w-full aspect-square">
                            <Image
                                src={post.images[0] || '/placeholder.png'}
                                alt="게시물"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>

                    {/* 우측 정보 패널 */}
                    <div className="w-full md:w-96 border-l border-gray-300 flex flex-col">
                        <div className="p-4 border-b border-gray-300">
                            <p className="text-sm font-semibold mb-1">좋아요 {post.likeCount}개</p>
                            <p className="text-sm text-gray-500">댓글 {post.commentCount}개</p>
                            {post.location && (
                                <p className="text-sm text-gray-500 mt-2">{post.location}</p>
                            )}
                        </div>

                        {post.caption && (
                            <div className="p-4 border-b border-gray-300">
                                <p className="text-sm whitespace-pre-wrap">{post.caption}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};