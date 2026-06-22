import { AuctionCard } from './AuctionCard';
import type { Auction } from '@/types';

export function AuctionGrid({ auctions }: { auctions: Auction[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {auctions.map((auction) => (
        <AuctionCard key={auction.id} auction={auction} />
      ))}
    </div>
  );
}
