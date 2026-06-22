import { Link } from 'react-router-dom';
import { CountdownBoxes } from './CountdownBoxes';
import { AuctionImage } from './AuctionImage';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Auction } from '@/types';

interface BidCardProps {
  auction: Auction;
  className?: string;
}

/**
 * Floating "current bid" card — a thumbnail, the live bid value and a labelled
 * countdown. Used overlapping the hero image; reusable elsewhere.
 */
export function BidCard({ auction, className }: BidCardProps) {
  return (
    <Link
      to={`/lote/${auction.id}`}
      className={cn(
        'block w-72 rounded-2xl border border-line bg-surface/95 p-3 shadow-float backdrop-blur transition-transform hover:-translate-y-1',
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <div className="size-12 shrink-0 overflow-hidden rounded-xl">
          <AuctionImage
            images={auction.images}
            alt={auction.title}
            category={auction.category}
            className="size-full"
          />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{auction.title}</p>
          <p className="text-xs text-muted-foreground">Lance atual</p>
        </div>
      </div>

      <p className="mt-2 font-display text-xl font-bold tabular-nums text-ink">
        {formatCurrency(auction.currentBid)}
      </p>

      <div className="mt-3 border-t border-line pt-3">
        <p className="mb-1.5 text-xs text-muted-foreground">Encerra em</p>
        <CountdownBoxes target={auction.endsAt} size="sm" />
      </div>
    </Link>
  );
}
