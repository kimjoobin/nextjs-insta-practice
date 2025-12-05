'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useCreatePost } from '@/features/post/hooks/usePost';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { getErrorMessage, validateImageFile, validateFileSize } from '@/shared/utils';
import { ROUTES } from '@/shared/constants';
import { AiOutlineClose } from 'react-icons/ai';
import { BsImage } from 'react-icons/bs';

export default function CreatePostPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');

  const { mutate: createPost, isLoading } = useCreatePost();

  // 인증 체크
  useEffect(() => {
    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN);
    }
  }, [isAuthenticated, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setError('');
    
    if (selectedFiles.length === 0) return;

    // 파일 유효성 검사
    for (const file of selectedFiles) {
      if (!validateImageFile(file)) {
        setError('이미지 파일만 업로드 가능합니다. (jpg, png, gif, webp)');
        return;
      }
      if (!validateFileSize(file, 10)) {
        setError('파일 크기는 10MB 이하여야 합니다.');
        return;
      }
    }

    setFiles(selectedFiles);

    // 이미지 미리보기 생성
    const previewUrls = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews(previewUrls);
  };

  const handleRemoveImage = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    
    // 이전 preview URL 해제
    URL.revokeObjectURL(previews[index]);
    
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (files.length === 0) {
      setError('이미지를 선택해주세요.');
      return;
    }

    setError('');

    createPost(
      {
        data: {
          caption: caption || undefined,
          location: location || undefined,
        },
        files,
      },
      {
        onError: (err) => {
          setError(getErrorMessage(err));
        },
        onSuccess: () => {
          // Preview URLs 정리
          previews.forEach(url => URL.revokeObjectURL(url));
        },
      }
    );
  };

  const handleCancel = () => {
    previews.forEach(url => URL.revokeObjectURL(url));
    router.back();
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-instagram-background">
      <Header />
      
      <main className="pt-20 pb-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-instagram-border rounded-lg">
            {/* 헤더 */}
            <div className="flex items-center justify-between p-4 border-b border-instagram-border">
              <h2 className="text-xl font-semibold">새 게시물 만들기</h2>
              <button
                onClick={handleCancel}
                className="text-instagram-text-light hover:text-instagram-text"
              >
                <AiOutlineClose className="text-2xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* 이미지 업로드 영역 */}
              <div className="p-8">
                {previews.length === 0 ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-instagram-border rounded-lg p-12 text-center cursor-pointer hover:bg-gray-50 transition"
                  >
                    <BsImage className="text-6xl text-instagram-text-light mx-auto mb-4" />
                    <p className="text-instagram-text-light mb-2">사진을 여기에 끌어다 놓으세요</p>
                    <Button
                      type="button"
                      variant="primary"
                      className="mt-4"
                    >
                      컴퓨터에서 선택
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {previews.map((preview, index) => (
                      <div key={index} className="relative">
                        <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition"
                        >
                          <AiOutlineClose />
                        </button>
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-3 border-2 border-dashed border-instagram-border rounded-lg text-instagram-blue font-semibold hover:bg-gray-50 transition"
                    >
                      + 사진 추가
                    </button>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* 캡션 및 위치 입력 */}
              <div className="border-t border-instagram-border p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">문구 입력</label>
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="문구를 입력하세요..."
                    className="w-full px-4 py-3 border border-instagram-border rounded-lg resize-none focus:outline-none focus:border-gray-400 transition"
                    rows={4}
                  />
                </div>

                <Input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="위치를 입력하세요"
                  label="위치 추가"
                />

                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  isLoading={isLoading}
                  disabled={files.length === 0}
                >
                  공유하기
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
