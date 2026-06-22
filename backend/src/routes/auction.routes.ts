import { Router } from 'express';
import {
  createAuctionHandler,
  deleteAuctionHandler,
  getAuctionHandler,
  listAuctionsHandler,
  updateAuctionHandler,
} from '../controllers/auction.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import { uploadAuctionImages } from '../middlewares/upload.js';
import { validateBody } from '../middlewares/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createAuctionSchema, updateAuctionSchema } from './auction.validators.js';

export const auctionRouter = Router();

auctionRouter.get('/', asyncHandler(listAuctionsHandler));
auctionRouter.get('/:id', asyncHandler(getAuctionHandler));

auctionRouter.post(
  '/',
  requireAuth,
  requireRole('AUCTIONEER'),
  uploadAuctionImages,
  validateBody(createAuctionSchema),
  asyncHandler(createAuctionHandler),
);

auctionRouter.patch(
  '/:id',
  requireAuth,
  requireRole('AUCTIONEER'),
  uploadAuctionImages,
  validateBody(updateAuctionSchema),
  asyncHandler(updateAuctionHandler),
);

auctionRouter.delete(
  '/:id',
  requireAuth,
  requireRole('AUCTIONEER'),
  asyncHandler(deleteAuctionHandler),
);
