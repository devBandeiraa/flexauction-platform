import { create } from 'zustand';
import type { User } from '@/types';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  status: AuthStatus;
  setAuth: (user: User, accessToken: string) => void;
  setToken: (accessToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  status: 'loading',
  setAuth: (user, accessToken) => set({ user, accessToken, status: 'authenticated' }),
  setToken: (accessToken) => set({ accessToken }),
  clearAuth: () => set({ user: null, accessToken: null, status: 'unauthenticated' }),
}));
