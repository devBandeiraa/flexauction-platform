import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { comparePassword, hashPassword } from '../utils/password.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';

interface RegisterInput {
  name: string;
  email: string;
  cpf: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

function refreshExpiryDate(): Date {
  const days = env.JWT_REFRESH_EXPIRES_IN_DAYS;
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

async function issueTokenPair(userId: string, role: 'USER' | 'AUCTIONEER') {
  const accessToken = signAccessToken({ sub: userId, role });
  const refreshToken = signRefreshToken({ sub: userId });

  await prisma.refreshToken.create({
    data: { token: refreshToken, userId, expiresAt: refreshExpiryDate() },
  });

  return { accessToken, refreshToken };
}

export async function register(input: RegisterInput) {
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email: input.email }, { cpf: input.cpf }] },
  });

  if (existing) {
    throw new AppError(409, 'User with this email or CPF already exists');
  }

  const hashed = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: { name: input.name, email: input.email, cpf: input.cpf, password: hashed },
  });

  const tokens = await issueTokenPair(user.id, user.role);

  return { user, ...tokens };
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  if (!user || !(await comparePassword(input.password, user.password))) {
    throw new AppError(401, 'Invalid email or password');
  }

  const tokens = await issueTokenPair(user.id, user.role);

  return { user, ...tokens };
}

export async function refresh(token: string) {
  let payload: { sub: string };

  try {
    payload = verifyRefreshToken(token);
  } catch {
    throw new AppError(401, 'Invalid or expired refresh token');
  }

  const stored = await prisma.refreshToken.findUnique({ where: { token } });

  if (!stored || stored.expiresAt < new Date()) {
    throw new AppError(401, 'Refresh token not recognized');
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });

  if (!user) {
    throw new AppError(401, 'User no longer exists');
  }

  await prisma.refreshToken.delete({ where: { token } });

  const tokens = await issueTokenPair(user.id, user.role);

  return { user, ...tokens };
}

export async function logout(token: string) {
  await prisma.refreshToken.deleteMany({ where: { token } });
}
