import type { Bid } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import * as bidRepository from '../repositories/bid.repository.js';
import { AppError } from '../utils/AppError.js';

const MIN_INCREMENT_RATE = 0.01; // a new bid must beat the current one by at least 1%
const ANTI_SNIPE_WINDOW_MS = 5 * 60 * 1000; // bids in the final 5 min extend the auction

/** Smallest acceptable next bid given the current value (rounded up to cents). */
export function minimumNextBid(currentBid: number): number {
  return Math.ceil(currentBid * (1 + MIN_INCREMENT_RATE) * 100) / 100;
}

export interface PlaceBidResult {
  bid: Bid & { user: { id: string; name: string } };
  totalBids: number;
  endsAt: Date;
  extended: boolean;
}

export function getAuctionBids(auctionId: string) {
  return bidRepository.findBidsByAuction(auctionId);
}

export function getUserBids(userId: string) {
  return bidRepository.findBidsByUser(userId);
}

export async function placeBid(
  auctionId: string,
  userId: string,
  value: number,
): Promise<PlaceBidResult> {
  return prisma.$transaction(async (tx) => {
    const auction = await tx.auction.findUnique({
      where: { id: auctionId },
      include: { bids: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });

    if (!auction) {
      throw new AppError(404, 'Auction not found');
    }

    if (auction.auctioneerId === userId) {
      throw new AppError(403, 'You cannot bid on your own auction');
    }

    const now = new Date();
    if (auction.status !== 'LIVE' || now < auction.startsAt || now >= auction.endsAt) {
      throw new AppError(409, 'This auction is not open for bids');
    }

    const lastBid = auction.bids[0];
    if (lastBid && lastBid.userId === userId) {
      throw new AppError(409, 'You are already the highest bidder');
    }

    const currentBid = Number(auction.currentBid);
    const minNext = minimumNextBid(currentBid);
    if (value < minNext) {
      throw new AppError(422, `Bid must be at least ${minNext.toFixed(2)}`);
    }

    // Anti-sniping: a bid in the final window pushes the end so 5 min always remain.
    const extended = auction.endsAt.getTime() - now.getTime() <= ANTI_SNIPE_WINDOW_MS;
    const endsAt = extended ? new Date(now.getTime() + ANTI_SNIPE_WINDOW_MS) : auction.endsAt;

    const bid = await tx.bid.create({
      data: { value, userId, auctionId },
      include: { user: { select: { id: true, name: true } } },
    });

    await tx.auction.update({
      where: { id: auctionId },
      data: { currentBid: value, ...(extended && { endsAt }) },
    });

    const totalBids = await tx.bid.count({ where: { auctionId } });

    return { bid, totalBids, endsAt, extended };
  });
}
