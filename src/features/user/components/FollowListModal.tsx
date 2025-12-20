'use client';

import {useFollowers, useFollowing, useFollowToggle} from "@/features/user/hooks/useProfile";
import {BsPersonSquare, BsX} from "react-icons/bs";
import Link from "next/link";
import Image from 'next/image';

interface FollowListModalProps {
    userSeq: string;
    type: 'followers' | 'following',
    onClose: () => void;
}

export const FollowListModal = ({
                                    userSeq,
                                    type,
                                    onClose
}: FollowListModalProps) => {
    const { data: followersData, isLoading: followersLoading } = useFollowers(userSeq);
    const { data: followingData, isLoading: followingLoading } = useFollowing(userSeq);
    const { toggleFollow } = useFollowToggle();

    const data = type === 'followers' ? followersData : followingData;
    const isLoading = type === 'followers' ? followersLoading : followingLoading;
    const users = data?.content || [];

    const handleFollowToggle = async (targetUsername: string, isFollowing: boolean) => {
        try {
            await toggleFollow(targetUsername, isFollowing);
        } catch (error) {
            console.error('팔로우 처리 실패:', error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-xl w-full max-w-md max-h-[80vh] flex flex-col">
                {/* 헤더 */}
                <div className="border-b border-gray-300 px-4 py-3 flex items-center justify-between">
                    <h2 className="text-base font-semibold">
                        {type === 'followers' ? '팔로워' : '팔로잉'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <BsX className="text-3xl" />
                    </button>
                </div>

                {/* 유저 리스트 */}
                <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                        <div className="p-4 space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-center gap-3 animate-pulse">
                                    <div className="w-11 h-11 bg-gray-200 rounded-full" />
                                    <div className="flex-1">
                                        <div className="h-3 bg-gray-200 rounded w-24 mb-2" />
                                        <div className="h-3 bg-gray-200 rounded w-16" />
                                    </div>
                                    <div className="w-20 h-8 bg-gray-200 rounded" />
                                </div>
                            ))}
                        </div>
                    ) : users.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            {type === 'followers' ? '팔로워가 없습니다' : '팔로잉이 없습니다'}
                        </div>
                    ) : (
                        <div className="p-4 space-y-4">
                            {users.map((user) => (
                                <div key={user.userSeq} className="flex items-center gap-3">
                                    <Link
                                        href={`/${user.username}`}
                                        onClick={onClose}
                                        className="flex items-center gap-3 flex-1 min-w-0"
                                    >
                                        <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                            {user.profileImage ? (
                                                <Image
                                                    src={user.profileImage}
                                                    alt={user.username}
                                                    width={44}
                                                    height={44}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
                                                    <BsPersonSquare />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm truncate">{user.username}</p>
                                            <p className="text-gray-500 text-sm truncate">{user.name}</p>
                                        </div>
                                    </Link>

                                    <button
                                        onClick={() => handleFollowToggle(user.username, user.isFollowing || false)}
                                        className={`px-4 py-1.5 rounded-lg font-semibold text-sm transition ${
                                            user.isFollowing
                                                ? 'bg-gray-200 hover:bg-gray-300'
                                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                                        }`}
                                    >
                                        {user.isFollowing ? '팔로잉' : '팔로우'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}