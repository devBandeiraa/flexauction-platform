// Provides the environment the app's config/env.ts validates at import time,
// so modules under test can be imported without a real .env file.
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.JWT_ACCESS_SECRET = 'test-access-secret-at-least-32-chars-long-xx';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-at-least-32-chars-long-x';
process.env.JWT_ACCESS_EXPIRES_IN = '15m';
process.env.JWT_REFRESH_EXPIRES_IN_DAYS = '7';
process.env.CORS_ORIGIN = 'http://localhost:5173';
