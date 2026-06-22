import { prisma } from '../config/prisma.js';
import { logger } from '../config/logger.js';
import { emitAuctionClosed } from '../sockets/index.js';

const TICK_MS = 15 * 1000;

/** Closes auctions whose window has elapsed and broadcasts the result. */
export async function closeExpiredAuctions(): Promise<void> {
  const expired = await prisma.auction.findMany({
    where: { status: 'LIVE', endsAt: { lte: new Date() } },
    include: { bids: { orderBy: { createdAt: 'desc' }, take: 1 } },
  });

  for (const auction of expired) {
    await prisma.auction.update({ where: { id: auction.id }, data: { status: 'CLOSED' } });

    emitAuctionClosed({
      loteId: auction.id,
      vencedorId: auction.bids[0]?.userId ?? null,
      valorFinal: Number(auction.currentBid),
    });

    logger.info({ auctionId: auction.id }, 'auction closed');
  }
}

export function startAuctionCloser(): NodeJS.Timeout {
  return setInterval(() => {
    closeExpiredAuctions().catch((err) => {
      logger.error({ err }, 'auction closer tick failed');
    });
  }, TICK_MS);
}
