/**
 * Simulated live-presence numbers for the homepage.
 *
 * Real participant/online counts will come from WebSocket later (deferred in
 * phase 1). Until then we show plausible, *stable* numbers derived
 * deterministically from the auction id, so a given lot always renders the
 * same figure instead of flickering between renders. Marketing-surface only —
 * never use these where an accurate count matters.
 */

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** People currently watching the lot — a small but lively number. */
export function onlineCount(auctionId: string): number {
  return 8 + (hash(auctionId) % 55); // 8–62
}

/** Distinct participants who have engaged with the lot. */
export function participantCount(auctionId: string, bidCount = 0): number {
  // At least as many participants as there are bids feels coherent.
  return Math.max(bidCount, 6 + (hash(auctionId + 'p') % 22)); // 6–27 floor
}
