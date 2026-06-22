import type { Request, Response } from 'express';
import * as bidService from '../services/bid.service.js';
import * as favoriteService from '../services/favorite.service.js';
import { AppError } from '../utils/AppError.js';

function requireUser(req: Request) {
  if (!req.user) {
    throw new AppError(401, 'Authentication required');
  }
  return req.user;
}

export async function getMyBidsHandler(req: Request, res: Response): Promise<void> {
  const user = requireUser(req);
  const bids = await bidService.getUserBids(user.id);
  res.json(bids);
}

export async function getMyFavoritesHandler(req: Request, res: Response): Promise<void> {
  const user = requireUser(req);
  const favorites = await favoriteService.listFavorites(user.id);
  res.json(favorites);
}

export async function addFavoriteHandler(req: Request, res: Response): Promise<void> {
  const user = requireUser(req);
  await favoriteService.addFavorite(user.id, req.params.id!);
  res.status(204).send();
}

export async function removeFavoriteHandler(req: Request, res: Response): Promise<void> {
  const user = requireUser(req);
  await favoriteService.removeFavorite(user.id, req.params.id!);
  res.status(204).send();
}
