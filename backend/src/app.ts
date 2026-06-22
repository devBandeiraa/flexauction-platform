import path from 'node:path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { pinoHttp } from 'pino-http';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { auctionRouter } from './routes/auction.routes.js';
import { authRouter } from './routes/auth.routes.js';
import { meRouter } from './routes/me.routes.js';
import { categoriesRouter, searchRouter } from './routes/meta.routes.js';

const app = express();

app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(pinoHttp({ logger }));

app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/auctions', auctionRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/search', searchRouter);
app.use('/api/me', meRouter);

app.use(errorHandler);

app.listen(env.PORT, () => {
  logger.info(`Server listening on port ${env.PORT}`);
});
