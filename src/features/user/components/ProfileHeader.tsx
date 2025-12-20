'use client';

import {ProfileUser} from "@/features/user/types/user";
import {useFollowToggle} from "@/features/user/hooks/useProfile";
import {useState} from "react";
import {FollowListModal} from "@/features/user/components/FollowListModal";
import {BsGear, BsPersonSquare} from "react-icons/bs";
import Image from 'next/image';
import {ProfileEditModal} from "@/features/user/components/ProfileEditModal";

interface ProfileHeaderProps {
    profile: ProfileUser;
    isOwnProfile: boolean;
}

export const ProfileHeader = ({
                                  profile,
                                  isOwnProfile
                              }: ProfileHeaderProps) => {

    const {toggleFollow, isLoading} = useFollowToggle();
    const [showEditModal, setShowEditModal] = useState(false);
    const [showFollowModal, setShowFollowModal] = useState<'followers' | 'following' | null>(null);

    const handleFollowClick = async () => {
        try {
            await toggleFollow(profile.username, profile.isFollowing || false);
        } catch (error) {
            console.error('팔로우 처리 실패:', error);
        }
    };

    return (
        <>
            <header className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex gap-8 md:gap-28">
                    {/* 프로필 이미지 */}
                    <div className="flex-shrink-0">
                        <div className="w-20 h-20 md:w-36 md:h-36 rounded-full overflow-hidden bg-gray-200 border-2 border-gray-300">
                            {profile.profileImage ? (
                                <Image
                                    src={profile.profileImage}
                                    alt={profile.username}
                                    width={150}
                                    height={150}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl md:text-6xl">
                                    <BsPersonSquare />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 프로필 정보 */}
                    <div className="flex-1 min-w-0">
                        {/* 사용자명 & 버튼 */}
                        <div className="flex items-center gap-4 mb-5 flex-wrap">
                            <h1 className="text-xl font-light">{profile.username}</h1>

                            {isOwnProfile ? (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setShowEditModal(true)}
                                        className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold text-sm transition"
                                    >
                                        프로필 편집
                                    </button>
                                    <button className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold text-sm transition">
                                        <BsGear className="text-lg" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleFollowClick}
                                        disabled={isLoading}
                                        className={`px-6 py-1.5 rounded-lg font-semibold text-sm transition disabled:opacity-50 ${
                                            profile.isFollowing
                                                ? 'bg-gray-200 hover:bg-gray-300'
                                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                                        }`}
                                    >
                                        {profile.isFollowing ? '팔로잉' : '팔로우'}
                                    </button>
                                    <button className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold text-sm transition">
                                        메시지 보내기
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* 통계 */}
                        <div className="flex gap-8 mb-5 text-base">
                            <div>
                                <span className="font-semibold">{profile.postCount}</span>
                                <span className="ml-1">게시물</span>
                            </div>
                            <button
                                onClick={() => setShowFollowModal('followers')}
                                className="hover:text-gray-600"
                            >
                                <span className="font-semibold">{profile.followerCount}</span>
                                <span className="ml-1">팔로워</span>
                            </button>
                            <button
                                onClick={() => setShowFollowModal('following')}
                                className="hover:text-gray-600"
                            >
                                <span className="font-semibold">{profile.followingCount}</span>
                                <span className="ml-1">팔로우</span>
                            </button>
                        </div>

                        {/* 이름 & 소개 */}
                        <div className="text-sm">
                            <p className="font-semibold mb-1">{profile.name}</p>
                            {profile.introduce && (
                                <p className="whitespace-pre-wrap break-words mb-1">{profile.introduce}</p>
                            )}
                            {profile.website && (
                                <a
                                    href={profile.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-900 font-semibold hover:underline"
                                >
                                    {profile.website}
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* 모달들 */}
            {showEditModal && (
                <ProfileEditModal
                    profile={profile}
                    onClose={() => setShowEditModal(false)}
                />
            )}

            {showFollowModal && (
                <FollowListModal
                    userSeq={profile.username}
                    type={showFollowModal}
                    onClose={() => setShowFollowModal(null)}
                />
            )}
        </>
    );

};