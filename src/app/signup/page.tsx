'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSignup } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { getErrorMessage } from '@/shared/utils';
import { ROUTES } from '@/shared/constants';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  const { mutate: signup, isLoading } = useSignup();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    signup(formData, {
      onError: (err) => {
        setError(getErrorMessage(err));
      },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isFormValid = formData.email && formData.name && formData.username && formData.password;

  return (
    <div className="min-h-screen flex items-center justify-center bg-instagram-background px-4">
      <div className="w-full max-w-sm">
        {/* 회원가입 카드 */}
        <div className="bg-white border border-instagram-border rounded-lg p-10 mb-3">
          {/* 로고 */}
          <h1 className="text-4xl font-bold font-serif text-center mb-4">Instagram</h1>
          
          {/* 설명 */}
          <p className="text-center text-instagram-text-light text-sm font-semibold mb-6">
            친구들의 사진과 동영상을 보려면 가입하세요.
          </p>

          {/* 회원가입 폼 */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="email"
              name="email"
              placeholder="이메일 주소"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              type="text"
              name="name"
              placeholder="성명"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <Input
              type="text"
              name="username"
              placeholder="사용자 이름"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <Input
              type="password"
              name="password"
              placeholder="비밀번호"
              value={formData.password}
              onChange={handleChange}
              required
            />

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            {/* 약관 동의 */}
            <p className="text-xs text-center text-instagram-text-light py-3">
              가입하면 Instagram의 약관, 데이터 정책 및 쿠키 정책에 동의하게 됩니다.
            </p>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
              disabled={!isFormValid}
            >
              가입
            </Button>
          </form>
        </div>

        {/* 로그인 카드 */}
        <div className="bg-white border border-instagram-border rounded-lg p-6 text-center">
          <p className="text-sm">
            계정이 있으신가요?{' '}
            <Link href={ROUTES.LOGIN} className="text-instagram-blue font-semibold">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
