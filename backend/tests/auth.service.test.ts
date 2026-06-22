import { jest } from '@jest/globals';
import { AppError } from '../src/utils/AppError.js';
import { hashPassword } from '../src/utils/password.js';

const prismaMock = {
  user: { findFirst: jest.fn(), findUnique: jest.fn(), create: jest.fn() },
  refreshToken: { create: jest.fn() },
};

jest.unstable_mockModule('../src/config/prisma.js', () => ({ prisma: prismaMock }));

const { register, login } = await import('../src/services/auth.service.js');

const registerInput = {
  name: 'Maria',
  email: 'maria@example.com',
  cpf: '11111111111',
  password: 'senha1234',
};

beforeEach(() => {
  jest.clearAllMocks();
  prismaMock.refreshToken.create.mockResolvedValue({});
});

describe('register', () => {
  it('rejects when email or CPF already exists', async () => {
    prismaMock.user.findFirst.mockResolvedValue({ id: 'existing' });
    await expect(register(registerInput)).rejects.toMatchObject({ statusCode: 409 });
  });

  it('creates the user and issues tokens', async () => {
    prismaMock.user.findFirst.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue({
      id: 'user-1',
      name: 'Maria',
      email: 'maria@example.com',
      role: 'USER',
    });

    const result = await register(registerInput);
    expect(result.user.id).toBe('user-1');
    expect(result.accessToken).toEqual(expect.any(String));
    expect(result.refreshToken).toEqual(expect.any(String));
    // Password must be hashed before persistence.
    const created = prismaMock.user.create.mock.calls[0]?.[0] as { data: { password: string } };
    expect(created.data.password).not.toBe('senha1234');
  });
});

describe('login', () => {
  it('rejects an unknown email', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    await expect(login({ email: 'x@y.com', password: 'whatever' })).rejects.toBeInstanceOf(AppError);
  });

  it('rejects a wrong password', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'user-1',
      role: 'USER',
      password: await hashPassword('correct-password'),
    });
    await expect(login({ email: 'maria@example.com', password: 'wrong' })).rejects.toMatchObject({
      statusCode: 401,
    });
  });

  it('accepts valid credentials', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'user-1',
      name: 'Maria',
      email: 'maria@example.com',
      role: 'USER',
      password: await hashPassword('senha1234'),
    });
    const result = await login({ email: 'maria@example.com', password: 'senha1234' });
    expect(result.user.id).toBe('user-1');
    expect(result.accessToken).toEqual(expect.any(String));
  });
});
