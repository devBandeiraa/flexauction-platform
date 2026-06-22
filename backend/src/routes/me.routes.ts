import { Router } from 'express';
import {
  addFavoriteHandler,
  getMyBidsHandler,
  getMyFavoritesHandler,
  removeFavoriteHandler,
} from '../controllers/me.controller.js';
import { requireAuth } from '../middlewares/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const meRouter = Router();

meRouter.use(requireAuth);

meRouter.get('/bids', asyncHandler(getMyBidsHandler));
meRouter.get('/favorites', asyncHandler(getMyFavoritesHandler));
meRouter.post('/favorites/:id', asyncHandler(addFavoriteHandler));
meRouter.delete('/favorites/:id', asyncHandler(removeFavoriteHandler));
