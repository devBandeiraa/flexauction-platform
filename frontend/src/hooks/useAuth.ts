import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import {
  bootstrapRequest,
  loginRequest,
  logoutRequest,
  registerRequest,
  type LoginInput,
  type RegisterInput,
} from '@/services/auth.api';

/** Restores the session once on app start using the refresh cookie. */
export function useBootstrapAuth(): void {
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  useEffect(() => {
    let active = true;
    bootstrapRequest()
      .then((res) => {
        if (active) setAuth(res.user, res.accessToken);
      })
      .catch(() => {
        if (active) clearAuth();
      });
    return () => {
      active = false;
    };
  }, [setAuth, clearAuth]);
}

export function useAuth() {
  const { user, status, setAuth, clearAuth } = useAuthStore();

  const login = async (input: LoginInput) => {
    const res = await loginRequest(input);
    setAuth(res.user, res.accessToken);
    return res.user;
  };

  const register = async (input: RegisterInput) => {
    const res = await registerRequest(input);
    setAuth(res.user, res.accessToken);
    return res.user;
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } finally {
      clearAuth();
    }
  };

  return {
    user,
    status,
    isAuthenticated: status === 'authenticated',
    login,
    register,
    logout,
  };
}
