import { Prisma } from '@prisma/client';
import * as auctionRepository from '../repositories/auction.repository.js';
import * as favoriteRepository from '../repositories/favorite.repository.js';
import { AppError } from '../utils/AppError.js';

export function listFavorites(userId: string) {
  return favoriteRepository.findFavoritesByUser(userId);
}

export async function addFavorite(userId: string, auctionId: string) {
  const auction = await auctionRepository.findAuctionById(auctionId);
  if (!auction) {
    throw new AppError(404, 'Auction not found');
  }

  try {
    await favoriteRepository.createFavorite(userId, auctionId);
  } catch (err) {
    // Unique constraint — already favorited; treat as idempotent success.
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return;
    }
    throw err;
  }
}

export async function removeFavorite(userId: string, auctionId: string) {
  await favoriteRepository.deleteFavorite(userId, auctionId);
}
