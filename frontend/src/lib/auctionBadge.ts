import type { Auction } from '@/types';

const DAY_MS = 24 * 60 * 60 * 1000;
const NEW_THRESHOLD_MS = 2 * DAY_MS;
const ENDING_SOON_THRESHOLD_MS = DAY_MS;
const DEAL_DISCOUNT_THRESHOLD = 30;

export type BadgeKind = 'disputed' | 'ending-soon' | 'deal' | 'new';

function discountPercent(currentBid: string, appraisal: string | null): number | null {
  if (!appraisal) return null;
  const bid = Number(currentBid);
  const appr = Number(appraisal);
  if (!appr || bid >= appr) return null;
  return Math.round((1 - bid / appr) * 100);
}

/**
 * Picks at most one badge per auction, evaluated in priority order:
 * most-bid-on (only if it actually has bids) > ending within 24h > deep
 * discount > recently created. `isMostBid` is computed by the caller across
 * the set of cards currently on screen, since "most disputed" is relative.
 */
export function pickBadge(auction: Auction, isMostBid: boolean): BadgeKind | null {
  const bidCount = auction._count?.bids ?? 0;
  if (isMostBid && bidCount >= 1) return 'disputed';

  const msToEnd = new Date(auction.endsAt).getTime() - Date.now();
  if (msToEnd > 0 && msToEnd < ENDING_SOON_THRESHOLD_MS) return 'ending-soon';

  const discount = discountPercent(auction.currentBid, auction.appraisal);
  if (discount !== null && discount >= DEAL_DISCOUNT_THRESHOLD) return 'deal';

  const msSinceCreated = Date.now() - new Date(auction.createdAt).getTime();
  if (msSinceCreated >= 0 && msSinceCreated < NEW_THRESHOLD_MS) return 'new';

  return null;
}
