'use client';

import {useParams} from "next/dist/client/components/navigation";
import {useRouter} from "next/navigation";
import {ProfileHeader} from "@/features/user/components/ProfileHeader";
import {ProfileTabs} from "@/features/user/components/ProfileTabs";
import {useAuthStore} from "@/features/auth/stores/authStore";
import {useProfile, useUserPosts} from "@/features/user/hooks/useProfile";
import {useState} from "react";
import {PostGrid} from "@/features/user/components/PostGrid";

type ProfileTab = 'posts' | 'saved' | 'tagged';

export default function ProfilePage() {
    const params = useParams();
    const router = useRouter();
    const userSeq = params.userSeq as string;

    const { user } = useAuthStore();
    const { data: profile, isLoading: profileLoading, error } = useProfile(userSeq);
    const { data: postsData, isLoading: postsLoading } = useUserPosts(userSeq);
    const [activeTab, setActiveTab] = useState<ProfileTab>('posts');

    // 현재 로그인한 사용자인지 확인
    const isOwnProfile = user?.userSeq === userSeq;

    if (profileLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-semibold mb-2">페이지를 사용할 수 없습니다.</h1>
                <p className="text-gray-500 mb-6">
                    요청하신 페이지를 사용할 수 없습니다.
                </p>
                <button
                    onClick={() => router.push('/')}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    홈으로 돌아가기
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-5xl mx-auto">
                {/* 프로필 헤더 */}
                <ProfileHeader
                    profile={profile}
                    isOwnProfile={isOwnProfile}
                />

                {/* 탭 */}
                <ProfileTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    isOwnProfile={isOwnProfile}
                />

                {/* 컨텐츠 */}
                <div className="px-4 py-8">
                    {activeTab === 'posts' && (
                        <PostGrid
                            posts={postsData?.content || []}
                            isLoading={postsLoading}
                        />
                    )}

                    {activeTab === 'saved' && isOwnProfile && (
                        <div className="text-center py-20 text-gray-500">
                            저장된 게시물이 없습니다
                        </div>
                    )}

                    {activeTab === 'tagged' && (
                        <div className="text-center py-20 text-gray-500">
                            태그된 게시물이 없습니다
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}