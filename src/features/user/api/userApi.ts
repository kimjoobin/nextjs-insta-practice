import {FollowUser, ProfileUser, UpdateProfileRequest} from "@/features/user/types/user";
import apiClient from "@/shared/api/client";
import {ApiResponse} from "@/types/common";
import {PageResponse, Post} from "@/features/post/types";
import {API_ENDPOINTS} from "@/shared/constants";

export const userApi = {
    // 프로필 조회
    getMyProfile: async (): Promise<ProfileUser> => {
        const response = await apiClient.get<ApiResponse<ProfileUser>>(
            API_ENDPOINTS.MY_PROFILE
        );

        return response.data;
    },

    // 다른 사용자 프로필 조회 (username 사용)
    getUserProfile: async (username: string): Promise<ProfileUser> => {
        const response = await apiClient.get<ApiResponse<ProfileUser>>(
            `/api/users/${username}`
        );
        return response.data;
    },

    // 프로필 수정
    updateProfile: async (formData: FormData): Promise<ProfileUser> => {
        const response = await apiClient.patch<ApiResponse<ProfileUser>>(
            API_ENDPOINTS.USER_UPDATE,
            formData
        );

        return response.data;
    },

    // 내 게시물 목록 (JWT 토큰 사용)
    getMyPosts: async (page: number, size: number): Promise<PageResponse<Post>> => {
        const response = await apiClient.get<ApiResponse<PageResponse<Post>>>(
            `${API_ENDPOINTS.MY_POSTS}?page=${page}&size=${size}`
        );

        return response.data || {
            content: [],
            page: 0,
            size: 0,
            totalElements: 0,
            totalPages: 0,
            firstPage: true,
            lastPage: true,
        };
    },

    // 사용자 게시글 목록
    getUserPosts: async (userSeq: string, page: number, size: number): Promise<PageResponse<Post>> => {
        const response = await apiClient.get<ApiResponse<PageResponse<Post>>>(
            `${API_ENDPOINTS.USER_POSTS(userSeq)}?page=${page}&size=${size}`
        );

        return response.data || {
            content: [],
            page: 0,
            size: 0,
            totalElements: 0,
            totalPages: 0,
            firstPage: true,
            lastPage: true,
        };
    },

    // 팔로우
    follow: async (username: string): Promise<void> => {
        await apiClient.post(`${API_ENDPOINTS.FOLLOW(username)}`);
    },

    // 언팔로우
    unfollow: async (username: string): Promise<void> => {
        await apiClient.delete(`${API_ENDPOINTS.UNFOLLOW(username)}`);
    },

    // 내 팔로워 목록
    getMyFollowers: async(page: number, size: number): Promise<PageResponse<FollowUser>> => {
        const response = await apiClient.get<ApiResponse<PageResponse<FollowUser>>>(
            `${API_ENDPOINTS.MY_FOLLOWER}?page=${page}&size=${size}`
        );

        return response.data || {
            content: [],
            page: 0,
            size: 0,
            totalElements: 0,
            totalPages: 0,
            firstPage: true,
            lastPage: true,
        };
    },

    // 다른 사용자 팔로워 목록 (username 사용)
    getUserFollowers: async (
        username: string,
        page: number,
        size: number
    ): Promise<PageResponse<FollowUser>> => {
        const response = await apiClient.get<ApiResponse<PageResponse<FollowUser>>>(
            `${API_ENDPOINTS.USER_FOLLOWERS(username)}?page=${page}&size=${size}`
        );
        return response.data;
    },

    // 내 팔로잉 목록
    getMyFollowing: async (page: number, size: number): Promise<PageResponse<FollowUser>> => {
        const response = await apiClient.get<ApiResponse<PageResponse<FollowUser>>>(
            `${API_ENDPOINTS.MY_FOLLOWING}?page=${page}&size=${size}`
        );

        return response.data || {
            content: [],
            page: 0,
            size: 0,
            totalElements: 0,
            totalPages: 0,
            firstPage: true,
            lastPage: true,
        };
    },

    // 다른 사람의 팔로잉 목록
    getUserFollowing: async (username: string, page: number, size: number): Promise<PageResponse<FollowUser>> => {
        const response = await apiClient.get<ApiResponse<PageResponse<FollowUser>>>(
            `${API_ENDPOINTS.USER_FOLLOWING(username)}?page=${page}&size=${size}`
        );

        return response.data || {
            content: [],
            page: 0,
            size: 0,
            totalElements: 0,
            totalPages: 0,
            firstPage: true,
            lastPage: true,
        };
    }
}