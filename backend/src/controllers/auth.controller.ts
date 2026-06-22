import type { Request, Response } from 'express';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import * as authService from '../services/auth.service.js';

const REFRESH_COOKIE = 'refreshToken';

const refreshCookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: env.JWT_REFRESH_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000,
};

function sanitizeUser(user: { id: string; name: string; email: string; role: string }) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export async function registerHandler(req: Request, res: Response): Promise<void> {
  const { user, accessToken, refreshToken } = await authService.register(req.body);
  res.cookie(REFRESH_COOKIE, refreshToken, refreshCookieOptions);
  res.status(201).json({ user: sanitizeUser(user), accessToken });
}

export async function loginHandler(req: Request, res: Response): Promise<void> {
  const { user, accessToken, refreshToken } = await authService.login(req.body);
  res.cookie(REFRESH_COOKIE, refreshToken, refreshCookieOptions);
  res.json({ user: sanitizeUser(user), accessToken });
}

export async function refreshHandler(req: Request, res: Response): Promise<void> {
  const token = req.cookies[REFRESH_COOKIE];

  if (!token) {
    throw new AppError(401, 'Missing refresh token');
  }

  const { user, accessToken, refreshToken } = await authService.refresh(token);
  res.cookie(REFRESH_COOKIE, refreshToken, refreshCookieOptions);
  res.json({ user: sanitizeUser(user), accessToken });
}

export async function logoutHandler(req: Request, res: Response): Promise<void> {
  const token = req.cookies[REFRESH_COOKIE];

  if (token) {
    await authService.logout(token);
  }

  res.clearCookie(REFRESH_COOKIE, refreshCookieOptions);
  res.status(204).send();
}
