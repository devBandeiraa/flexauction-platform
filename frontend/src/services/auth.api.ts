import { apiFetch } from './api';
import type { User } from '@/types';

interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  cpf: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export function registerRequest(input: RegisterInput): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/register', { method: 'POST', body: input, auth: false });
}

export function loginRequest(input: LoginInput): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/login', { method: 'POST', body: input, auth: false });
}

export function logoutRequest(): Promise<void> {
  return apiFetch<void>('/auth/logout', { method: 'POST', auth: false });
}

/** Restores a session from the httpOnly refresh cookie, or null if absent/expired. */
export function bootstrapRequest(): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/refresh', { method: 'POST', auth: false });
}
