import { buildPaginatedResult, paginationOffset } from '../src/utils/pagination.js';
import { comparePassword, hashPassword } from '../src/utils/password.js';
import { signAccessToken, verifyAccessToken } from '../src/utils/jwt.js';

describe('pagination', () => {
  it('computes offset from page and limit', () => {
    expect(paginationOffset({ page: 1, limit: 12 })).toEqual({ skip: 0, take: 12 });
    expect(paginationOffset({ page: 3, limit: 10 })).toEqual({ skip: 20, take: 10 });
  });

  it('builds a paginated result with derived totalPages', () => {
    const result = buildPaginatedResult([1, 2, 3], 25, { page: 1, limit: 10 });
    expect(result).toMatchObject({ total: 25, totalPages: 3, page: 1, limit: 10 });
    expect(result.items).toHaveLength(3);
  });

  it('never reports fewer than one page', () => {
    expect(buildPaginatedResult([], 0, { page: 1, limit: 10 }).totalPages).toBe(1);
  });
});

describe('password hashing', () => {
  it('hashes and verifies a password', async () => {
    const hash = await hashPassword('senha1234');
    expect(hash).not.toBe('senha1234');
    expect(await comparePassword('senha1234', hash)).toBe(true);
    expect(await comparePassword('wrong', hash)).toBe(false);
  });
});

describe('jwt', () => {
  it('signs and verifies an access token round-trip', () => {
    const token = signAccessToken({ sub: 'user-1', role: 'USER' });
    const payload = verifyAccessToken(token);
    expect(payload.sub).toBe('user-1');
    expect(payload.role).toBe('USER');
  });

  it('rejects a tampered token', () => {
    expect(() => verifyAccessToken('not-a-real-token')).toThrow();
  });
});
