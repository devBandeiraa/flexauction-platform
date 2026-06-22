import { useAuthStore } from '@/store/auth.store';

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api';

export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors?: Record<string, string[]>;

  constructor(status: number, message: string, fieldErrors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  auth?: boolean;
}

async function parseError(res: Response): Promise<ApiError> {
  let message = res.statusText;
  let fieldErrors: Record<string, string[]> | undefined;
  try {
    const data = await res.json();
    if (typeof data?.message === 'string') message = data.message;
    if (data?.errors) fieldErrors = data.errors;
  } catch {
    // non-JSON error body — keep the status text
  }
  return new ApiError(res.status, message, fieldErrors);
}

let refreshPromise: Promise<boolean> | null = null;

async function refreshToken(): Promise<boolean> {
  refreshPromise ??= (async () => {
    try {
      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) return false;
      const data = await res.json();
      useAuthStore.getState().setAuth(data.user, data.accessToken);
      return true;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}

function buildInit(options: RequestOptions): RequestInit {
  const headers = new Headers(options.headers);
  const isFormData = options.body instanceof FormData;

  if (options.body !== undefined && !isFormData) {
    headers.set('Content-Type', 'application/json');
  }

  const token = useAuthStore.getState().accessToken;
  if (token) headers.set('Authorization', `Bearer ${token}`);

  return {
    ...options,
    headers,
    credentials: 'include',
    body: isFormData
      ? (options.body as FormData)
      : options.body !== undefined
        ? JSON.stringify(options.body)
        : undefined,
  };
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const exec = () => fetch(`${API_URL}${path}`, buildInit(options));

  let res = await exec();

  // Transparently refresh once on an expired access token, then retry.
  if (res.status === 401 && options.auth !== false) {
    const refreshed = await refreshToken();
    if (refreshed) {
      res = await exec();
    } else {
      useAuthStore.getState().clearAuth();
    }
  }

  if (!res.ok) {
    throw await parseError(res);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}
