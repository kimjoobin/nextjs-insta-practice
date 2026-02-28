import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/shared/constants';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  
  // Actions
  setAuth: (user: User, accessToken: string) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken) => {
         // 🔥 수동으로 localStorage에 직접 저장(미들웨어에서 접근 가능)
        if (typeof window !== 'undefined') {
          document.cookie = `accessToken=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
        }
        
        // Zustand persist가 알아서 localStorage에 저장함
        set({
          user,
          accessToken,
          isAuthenticated: true,
        });
      },

      clearAuth: () => {      
        // 🔥 수동으로 localStorage 삭제
        if (typeof window !== 'undefined') {
          document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }  
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        });
      },

      updateUser: (updatedUser) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        }));
      },
    }),
    {
      name: STORAGE_KEYS.USER_INFO,
      // 🔥 accessToken도 localStorage에 저장!
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken, // 🔥 추가
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
