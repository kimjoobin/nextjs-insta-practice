'use client';

import Image from 'next/image';
import {ProfileUser} from "@/features/user/types/user";
import {useRef, useState} from "react";
import {useUpdateProfile} from "@/features/user/hooks/useProfile";
import {BsPersonSquare, BsX} from "react-icons/bs";

interface ProfileEditModalProps {
    profile: ProfileUser;
    onClose: () => void;
}

export const ProfileEditModal = ({profile, onClose}: ProfileEditModalProps) => {
    const [formData, setFormData] = useState({
        name: profile.name,
        introduce: profile.introduce || '',
        website: profile.website || '',
    });

    const [previewImage, setPreviewImage] = useState<string | null>(profile.profileImage || null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const updateProfileMutation = useUpdateProfile();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const payload: any = {
                name: formData.name,
                introduce: formData.introduce,
                website: formData.website,
            };

            if (selectedFile) {
                payload.profileImage = selectedFile;
            }

            await updateProfileMutation.mutateAsync(payload);
            onClose();
        } catch (error) {
            console.error('프로필 수정 실패: ', error);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                {/* 헤더 */}
                <div
                    className="sticky top-0 bg-white border-b border-gray-300 px-4 py-3 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">프로필 편집</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <BsX className="text-3xl"/>
                    </button>
                </div>

                {/* 폼 */}
                <form onSubmit={handleSubmit} className="p-6">
                    {/* 프로필 이미지 변경 */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mb-3">
                            {previewImage ? (
                                <Image
                                    src={previewImage}
                                    alt="프로필"
                                    width={96}
                                    height={96}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-5xl">
                                    <BsPersonSquare/>
                                </div>
                            )}
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-blue-500 font-semibold text-sm hover:text-blue-700"
                        >
                            프로필 사진 바꾸기
                        </button>
                    </div>

                    {/* 이름 */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2">이름</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-400"
                            maxLength={50}
                            required
                        />
                    </div>

                    {/* 소개 */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2">소개</label>
                        <textarea
                            value={formData.introduce}
                            onChange={(e) => setFormData({...formData, introduce: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-400 resize-none"
                            rows={3}
                            maxLength={250}
                        />
                        <p className="text-xs text-gray-500 text-right mt-1">
                            {formData.introduce.length}/250
                        </p>
                    </div>

                    {/* 웹사이트 */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold mb-2">웹사이트</label>
                        <input
                            type="url"
                            value={formData.website}
                            onChange={(e) => setFormData({...formData, website: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-400"
                            placeholder="https://..."
                        />
                    </div>

                    {updateProfileMutation.isError && (
                        <p className="text-red-500 text-sm text-center mb-4">
                            프로필 수정에 실패했습니다.
                        </p>
                    )}

                    {/* 버튼 */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={updateProfileMutation.isPending}
                            className="flex-1 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:bg-blue-300"
                        >
                            {updateProfileMutation.isPending ? '저장 중...' : '저장'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};