import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { postApi } from '../api/postApi';
import { QUERY_KEYS, ROUTES } from '@/shared/constants';
import type { CreatePostRequest, UpdatePostRequest } from '../types';

// 피드 목록 조회 Hook
export const usePosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.POSTS],
    queryFn: () => postApi.getPosts(),
    staleTime: 1000 * 60 * 5, // 5분
  });
};

// 피드 상세 조회 Hook
export const usePost = (postSeq: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.POST_DETAIL(postSeq),
    queryFn: () => postApi.getPost(postSeq),
    enabled: !!postSeq,
  });
};

// 피드 등록 Hook
export const useCreatePost = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, files }: { data: CreatePostRequest; files: File[] }) =>
      postApi.createPost(data, files),
    onSuccess: () => {
      // 피드 목록 캐시 무효화
      queryClient.invalidateQueries([QUERY_KEYS.POSTS]);
      alert('게시물이 업로드되었습니다!');
      router.push(ROUTES.HOME);
    },
  });
};

// 피드 수정 Hook
export const useUpdatePost = (postSeq: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePostRequest) => postApi.updatePost(postSeq, data),
    onSuccess: () => {
      // 관련 캐시 무효화
      queryClient.invalidateQueries([QUERY_KEYS.POSTS]);
      queryClient.invalidateQueries(QUERY_KEYS.POST_DETAIL(postSeq));
      alert('게시물이 수정되었습니다!');
    },
  });
};

// 피드 삭제 Hook
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postSeq: string) => postApi.deletePost(postSeq),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.POSTS]);
      alert('게시물이 삭제되었습니다!');
    },
  });
};

// 좋아요 토글 Hook
export const useToggleLike = (postSeq: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => postApi.toggleLike(postSeq),
    onMutate: async () => {
      // Optimistic Update
      await queryClient.cancelQueries([QUERY_KEYS.POSTS]);
      
      const previousPosts = queryClient.getQueryData([QUERY_KEYS.POSTS]);
      
      // 낙관적 업데이트
      queryClient.setQueryData([QUERY_KEYS.POSTS], (old: any) => {
        if (!old) return old;
        
        return old.map((post: any) => {
          if (post.postSeq === postSeq) {
            return {
              ...post,
              isLiked: !post.isLiked,
              likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1,
            };
          }
          return post;
        });
      });
      
      return { previousPosts };
    },
    onError: (err, variables, context) => {
      // 에러 시 이전 상태로 롤백
      if (context?.previousPosts) {
        queryClient.setQueryData([QUERY_KEYS.POSTS], context.previousPosts);
      }
    },
    onSettled: () => {
      // 최종적으로 서버 데이터로 동기화
      queryClient.invalidateQueries([QUERY_KEYS.POSTS]);
    },
  });
};
