import {useAuthStore} from "@/features/auth/stores/authStore";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {userApi} from "@/features/user/api/userApi";
import {UpdateProfileRequest} from "@/features/user/types/user";

interface UpdateProfileData {
    username?: string;
    name?: string;
    bio?: string;
}

interface UpdateProfileParams {
    data: UpdateProfileData;
    file?: File;
}

/**
 * 프로필 조회 (내 프로필이면 /me, 아니면 /{userSeq})
 * @param userSeq
 */
export const useProfile = (userSeq: string) => {
    const { user } = useAuthStore();
    const isOwnProfile = userSeq === user?.userSeq;

    return useQuery({
        queryKey: ['profile', userSeq],
        queryFn: () =>
            isOwnProfile
                ? userApi.getMyProfile()
                : userApi.getUserProfile(userSeq),
        enabled: !!userSeq,
        staleTime: 1000 * 60 * 5, // 5분
    });
};

// 내 프로필 조회
export const useMyProfile = () => {
    return useQuery({
        queryKey: ['profile', 'me'],
        queryFn: () => userApi.getMyProfile(),
        staleTime: 1000 * 60 * 5,
    });
};

// 프로필 수정
export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    return useMutation({
        mutationFn: async ({data, file}: UpdateProfileParams) => {
            const formData = new FormData();

            const requestBody = {
                username: data.username || null,
                name: data.name || null,
                bio: data.bio || null,
            }

            formData.append('request', JSON.stringify(requestBody));
            if (file) {
                formData.append('file', file);
            }

            return userApi.updateProfile(formData);

        },
        onSuccess: (updatedProfile) => {
            // 내 프로필 캐시 업데이트
            queryClient.setQueryData(['profile', 'me'], updatedProfile);
            if (user?.username) {
                queryClient.setQueryData(['profile', user.username], updatedProfile);
            }
            // auth store의 사용자 정보도 업데이트 필요시 처리
        },
    });
};

// 사용자 게시물 목록
export const useUserPosts = (userSeq: string, page: number = 0, size: number = 12) => {
    const { user } = useAuthStore();
    const isOwnProfile = user?.userSeq === userSeq;

    return useQuery({
        queryKey: ['userPosts', userSeq, page, size],
        queryFn: () =>
            isOwnProfile
                ? userApi.getMyPosts(page, size)
                : userApi.getUserPosts(userSeq, page, size),
        enabled: !!userSeq,
        staleTime: 1000 * 60 * 5,
    });
};

// 팔로우 토글
export const useFollowToggle = () => {
    const queryClient = useQueryClient();

    const followMutation = useMutation({
        mutationFn: (username: string) => userApi.follow(username),
    });

    const unfollowMutation = useMutation({
        mutationFn: (username: string) => userApi.unfollow(username),
    });

    const toggleFollow = async (username: string, isFollowing: boolean) => {
        // Optimistic Update
        queryClient.setQueryData(['profile', username], (old: any) => {
            if (!old) return old;
            return {
                ...old,
                isFollowing: !isFollowing,
                followerCount: isFollowing ? old.followerCount - 1 : old.followerCount + 1,
            };
        });

        try {
            if (isFollowing) {
                await unfollowMutation.mutateAsync(username);
            } else {
                await followMutation.mutateAsync(username);
            }
        } catch (error) {
            // Rollback on error
            queryClient.setQueryData(['profile', username], (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    isFollowing: isFollowing,
                    followerCount: isFollowing ? old.followerCount + 1 : old.followerCount - 1,
                };
            });
            throw error;
        }
    };

    return {
        toggleFollow,
        isLoading: followMutation.isPending || unfollowMutation.isPending,
    };
};

// 팔로워 목록 (내 팔로워면 /me/followers, 아니면 /{username}/followers)
export const useFollowers = (username: string, page: number = 0, size: number = 10) => {
    const { user } = useAuthStore();
    const isOwnProfile = user?.userSeq === username;

    return useQuery({
        queryKey: ['followers', username, page],
        queryFn: () =>
            isOwnProfile
                ? userApi.getMyFollowers(page, size)
                : userApi.getUserFollowers(username, page, size),
        enabled: !!username,
    });
};

// 팔로잉 목록 (내 팔로잉이면 /me/following, 아니면 /{username}/following)
export const useFollowing = (username: string, page: number = 0, size: number = 10) => {
    const { user } = useAuthStore();
    const isOwnProfile = user?.username === username;

    return useQuery({
        queryKey: ['following', username, page],
        queryFn: () =>
            isOwnProfile
                ? userApi.getMyFollowing(page, size)
                : userApi.getUserFollowing(username, page, size),
        enabled: !!username,
    });
};


