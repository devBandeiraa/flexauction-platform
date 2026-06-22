import { prisma } from '../config/prisma.js';

export function findFavoritesByUser(userId: string) {
  return prisma.favorite.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      auction: {
        include: {
          auctioneer: { select: { id: true, name: true } },
          _count: { select: { bids: true } },
        },
      },
    },
  });
}

export function createFavorite(userId: string, auctionId: string) {
  return prisma.favorite.create({ data: { userId, auctionId } });
}

export function deleteFavorite(userId: string, auctionId: string) {
  return prisma.favorite.deleteMany({ where: { userId, auctionId } });
}
