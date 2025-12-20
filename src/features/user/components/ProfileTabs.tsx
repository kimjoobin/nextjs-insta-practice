'use client';

import {BsBookmark, BsGrid3X3, BsPersonSquare} from "react-icons/bs";

type ProfileTab = 'posts' | 'saved' | 'tagged';

interface ProfileTabsProps {
    activeTab: ProfileTab;
    onTabChange: (tab: ProfileTab) => void;
    isOwnProfile: boolean;
}

export const ProfileTabs = ({
                                activeTab,
                                onTabChange,
                                isOwnProfile
                            }: ProfileTabsProps) => {

    return (
        <div className="border-t border-gray-300">
            <div className="max-w-4xl mx-auto flex justify-center">
                <button
                    onClick={() => onTabChange('posts')}
                    className={`flex items-center gap-1 px-4 py-4 border-t text-xs font-semibold tracking-wide ${
                        activeTab === 'posts'
                            ? 'border-black text-black'
                            : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                >
                    <BsGrid3X3 className="text-sm"/>
                    <span>게시물</span>
                </button>

                {isOwnProfile && (
                    <button
                        onClick={() => onTabChange('saved')}
                        className={`flex items-center gap-1 px-4 py-4 border-t text-xs font-semibold tracking-wide ${
                            activeTab === 'saved'
                                ? 'border-black text-black'
                                : 'border-transparent text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        <BsBookmark className="text-sm"/>
                        <span>저장됨</span>
                    </button>
                )}

                <button
                    onClick={() => onTabChange('tagged')}
                    className={`flex items-center gap-1 px-4 py-4 border-t text-xs font-semibold tracking-wide ${
                        activeTab === 'tagged'
                            ? 'border-black text-black'
                            : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                >
                    <BsPersonSquare className="text-sm"/>
                    <span>태그됨</span>
                </button>
            </div>
        </div>
    );
};