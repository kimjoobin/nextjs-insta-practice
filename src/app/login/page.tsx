'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLogin } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { getErrorMessage } from '@/shared/utils';
import { ROUTES } from '@/shared/constants';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  const { mutate: login, isLoading } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    login(formData, {
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-instagram-background px-4">
      <div className="w-full max-w-sm">
        {/* 로그인 카드 */}
        <div className="bg-white border border-instagram-border rounded-lg p-10 mb-3">
          {/* 로고 */}
          <h1 className="text-4xl font-bold font-serif text-center mb-8">Instagram</h1>

          {/* 로그인 폼 */}
          <form onSubmit={handleSubmit} className="space-y-3">
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

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
              disabled={!formData.username || !formData.password}
            >
              로그인
            </Button>
          </form>

          {/* 구분선 */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-instagram-border"></div>
            <span className="px-4 text-sm text-instagram-text-light font-semibold">또는</span>
            <div className="flex-1 border-t border-instagram-border"></div>
          </div>

          {/* 비밀번호 찾기 */}
          <div className="text-center">
            <a href="#" className="text-xs text-instagram-blue">
              비밀번호를 잊으셨나요?
            </a>
          </div>
        </div>

        {/* 회원가입 카드 */}
        <div className="bg-white border border-instagram-border rounded-lg p-6 text-center">
          <p className="text-sm">
            계정이 없으신가요?{' '}
            <Link href={ROUTES.SIGNUP} className="text-instagram-blue font-semibold">
              가입하기
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
