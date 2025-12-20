export interface User {
    userSeq: string;
    username: string;
    email: string;
    name: string;
    phone?: string;
    introduce?: string;
    website?: string;
    followerCount: number;
    followingCount: number;
    postCount: number;
    profileImage?: string;
    createdAt: string;      // 🔥 추가
    updatedAt: string;      // 🔥 추가
}

export interface ProfileUser extends User {
    isFollowing?: boolean;
    isFollowedBy?: boolean;
}

export interface UpdateProfileRequest {
    name?: string;
    introduce?: string;
    website?: string;
    profileImage?: File;
}

export interface FollowUser {
    userSeq: string;
    username: string;
    name: string;
    profileImage?: string;
    isFollowing?: boolean;
}