import { create } from 'zustand';

export type AuthMode = 'login' | 'register';

interface UiState {
  authModalOpen: boolean;
  authMode: AuthMode;
  openAuth: (mode?: AuthMode) => void;
  closeAuth: () => void;
  setAuthMode: (mode: AuthMode) => void;
}

export const useUiStore = create<UiState>((set) => ({
  authModalOpen: false,
  authMode: 'login',
  openAuth: (mode = 'login') => set({ authModalOpen: true, authMode: mode }),
  closeAuth: () => set({ authModalOpen: false }),
  setAuthMode: (mode) => set({ authMode: mode }),
}));
