import { prisma } from '../config/prisma.js';

export function findBidsByAuction(auctionId: string, take = 20) {
  return prisma.bid.findMany({
    where: { auctionId },
    orderBy: { createdAt: 'desc' },
    take,
    include: { user: { select: { id: true, name: true } } },
  });
}

export function findBidsByUser(userId: string) {
  return prisma.bid.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      auction: {
        select: { id: true, title: true, status: true, currentBid: true, endsAt: true, images: true },
      },
    },
  });
}
