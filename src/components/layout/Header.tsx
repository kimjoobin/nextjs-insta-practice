'use client';

import Link from 'next/link';
import { AiOutlineHome, AiOutlinePlusSquare, AiOutlineHeart, AiOutlineCompass } from 'react-icons/ai';
import { BiSearchAlt } from 'react-icons/bi';
import { useLogout } from '@/features/auth/hooks/useAuth';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { ROUTES } from '@/shared/constants';

export const Header = () => {
  const user = useAuthStore((state) => state.user);
  const { mutate: logout } = useLogout();

  const handleLogout = () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      logout();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-instagram-border z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* 로고 */}
        <Link href={ROUTES.HOME} className="text-2xl font-bold font-serif">
          Instagram
        </Link>

        {/* 검색바 */}
        <div className="hidden md:block flex-1 max-w-xs mx-8">
          <div className="relative">
            <input
              type="text"
              placeholder="검색"
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none"
            />
            <BiSearchAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          </div>
        </div>

        {/* 네비게이션 아이콘 */}
        <nav className="flex items-center gap-6">
          <Link href={ROUTES.HOME} className="hover:text-gray-600 transition">
            <AiOutlineHome className="text-2xl" />
          </Link>
          <Link href={ROUTES.CREATE_POST} className="hover:text-gray-600 transition">
            <AiOutlinePlusSquare className="text-2xl" />
          </Link>
          <button className="hover:text-gray-600 transition">
            <AiOutlineCompass className="text-2xl" />
          </button>
          <button className="hover:text-gray-600 transition">
            <AiOutlineHeart className="text-2xl" />
          </button>
          <button
            onClick={handleLogout}
            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition"
            title={user?.username || '프로필'}
          >
            <span className="text-xs font-semibold">
              {user?.username ? user.username[0].toUpperCase() : '나'}
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
};
