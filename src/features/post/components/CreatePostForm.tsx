// src/features/post/components/CreatePostForm.tsx
'use client';

import { useRef, useState } from 'react';
import { useCreatePost } from '@/features/post/hooks/usePost';
import Image from 'next/image';
import { getErrorMessage, validateFileSize, validateImageFile } from '@/shared/utils';
import { Button } from '@/components/common/Button';
import { BsChevronLeft, BsChevronRight, BsImage } from 'react-icons/bs';
import { AiOutlineClose } from 'react-icons/ai';
import { Input } from '@/components/common/Input';
import { FILE_CONSTRAINTS } from '@/shared/constants';

interface CreatePostFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreatePostForm({ onSuccess, onCancel }: CreatePostFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<File[]>([]); // 첨부파일
  const [previews, setPreviews] = useState<string[]>([]); // 첨부파일 미리보기
  const [currentIndex, setCurrentIndex] = useState(0);  // 첨부파일 index
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  
  const { mutate: createPost, isPending } = useCreatePost();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setError('');
    
    if (selectedFiles.length === 0) return;

    // 기존 파일에 새 파일 추가 (덮어쓰기 방지)
    const newFiles = [...files, ...selectedFiles];

    // 최대 개수 체크
    if (newFiles.length > FILE_CONSTRAINTS.MAX_FILES_COUNT) {
      setError(`최대 ${FILE_CONSTRAINTS.MAX_FILES_COUNT}개까지 업로드 가능합니다.`);
      return;
    }

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

    console.log('files: ', selectedFiles)

    setFiles(selectedFiles);

    // 이미지 미리보기 생성
    const newPreviewUrls = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviewUrls]);
  };

  const handleRemoveImage = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);

    URL.revokeObjectURL(previews[index]);

    setFiles(newFiles);
    setPreviews(newPreviews);

    // 현재 인덱스 조정
    if (currentIndex >= newPreviews.length && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }

  const handlePrevImage = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : previews.length - 1));
  }

  const handleNextImage = () => {
    setCurrentIndex((prev) => (prev < previews.length - 1 ? prev + 1 : 0));
  }

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
          // 성공 후 form 초기화
          previews.forEach(url => URL.revokeObjectURL(url));
          setCaption('');
          setLocation('');
          setFiles([]);
          setPreviews([]);
          // 부모 컴포넌트의 onSuccess 콜백 실행
          onSuccess?.();
        }
      }
    )
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-instagram-border rounded-lg">
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
            {/* 🔥 인스타그램 스타일 이미지 슬라이더 */}
            <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={previews[currentIndex]}
                alt={`Preview ${currentIndex + 1}`}
                fill
                className="object-cover"
              />
              
              {/* 삭제 버튼 */}
              <button
                type="button"
                onClick={() => handleRemoveImage(currentIndex)}
                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition z-10"
              >
                <AiOutlineClose />
              </button>

              {/* 이전/다음 버튼 (이미지가 2개 이상일 때만) */}
              {previews.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition"
                  >
                    <BsChevronLeft className="text-xl" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition"
                  >
                    <BsChevronRight className="text-xl" />
                  </button>

                  {/* 인디케이터 (점) */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {previews.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setCurrentIndex(index)}
                        className={`w-1.5 h-1.5 rounded-full transition ${
                          index === currentIndex
                            ? 'bg-white'
                            : 'bg-white bg-opacity-50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* 썸네일 목록 */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {previews.map((preview, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer border-2 transition ${
                    index === currentIndex
                      ? 'border-instagram-blue'
                      : 'border-transparent'
                  }`}
                >
                  <Image
                    src={preview}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            
            {/* 사진 추가 버튼 */}
            {files.length < FILE_CONSTRAINTS.MAX_FILES_COUNT && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 border-2 border-dashed border-instagram-border rounded-lg text-instagram-blue font-semibold hover:bg-gray-50 transition"
              >
                + 사진 추가 ({files.length}/{FILE_CONSTRAINTS.MAX_FILES_COUNT})
              </button>
            )}
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

        <div className="flex gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              className="flex-1"
            >
              취소
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            isLoading={isPending}
            disabled={files.length === 0}
          >
            공유하기
          </Button>
        </div>
      </div>
    </form>
  );
}