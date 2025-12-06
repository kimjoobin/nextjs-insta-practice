// src/features/post/hooks/usePost.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { postApi } from '../api/postApi';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/shared/constants';
import { CreatePostForm } from '../components/CreatePostForm';
import { PageResponse, Post } from '../types';

interface CreatePostData {
  caption?: string;
  location?: string;
}

interface CreatePostParams {
  data: CreatePostData;
  files: File[];
}

// 피드 목록 조회
export function usePosts(page: number = 0, size: number = 10) {
  return useQuery<PageResponse<Post>>({
    queryKey: ['posts', page, size],
    queryFn: () => postApi.getPosts(page, size),
  });
}

// 피드 등록
export function useCreatePost() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ data, files }: CreatePostParams) => {
      const formData = new FormData();

      // request JSON 추가
      const request = {
        caption: data.caption || null,
        location: data.location || null,
      };
      formData.append('request', new Blob([JSON.stringify(request)], {type: 'application/json'}));

      // 파일 추가
      files.forEach(file => {
        formData.append('files', file);
      });

      return postApi.createPost(formData);
    },
    onSuccess: () => {
      // 피드 목록 다시 가져오기
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      // 피드 페이지로 이동
      router.push(ROUTES.FEED);
    }
  });
}

// 좋아요 토글
export function useToggleLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postSeq: string) => {
      // TODO: 실제 API 연동 (Phase 2에서 구현)
      // return postApi.toggleLike(postSeq);
      console.log('좋아요 토글:', postSeq);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}