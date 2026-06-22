import { Link } from 'react-router-dom';
import { Gavel, MapPin } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { Countdown } from './Countdown';
import { AuctionImage } from './AuctionImage';
import { formatCurrency } from '@/lib/format';
import type { Auction } from '@/types';

function discountPercent(currentBid: string, appraisal: string | null): number | null {
  if (!appraisal) return null;
  const bid = Number(currentBid);
  const appr = Number(appraisal);
  if (!appr || bid >= appr) return null;
  return Math.round((1 - bid / appr) * 100);
}

export function AuctionCard({ auction }: { auction: Auction }) {
  const discount = discountPercent(auction.currentBid, auction.appraisal);
  const bidCount = auction._count?.bids ?? 0;

  return (
    <Link
      to={`/lote/${auction.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <AuctionImage
          images={auction.images}
          alt={auction.title}
          category={auction.category}
          className="size-full transition-transform duration-300 group-hover:scale-105"
        />
        <StatusBadge status={auction.status} className="absolute left-3 top-3" />
        {discount !== null && (
          <span className="absolute right-3 top-3 rounded-full bg-success px-2.5 py-1 text-xs font-semibold text-success-foreground">
            {discount}% abaixo do avaliado
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="line-clamp-2 font-semibold text-text-primary">{auction.title}</h3>

        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="size-3.5" />
          {auction.city}/{auction.state}
        </p>

        <div className="mt-auto space-y-2">
          <div>
            <span className="block text-xs text-muted-foreground">Lance atual</span>
            <span className="font-mono text-xl font-bold text-primary">
              {formatCurrency(auction.currentBid)}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Gavel className="size-3.5" /> {bidCount} {bidCount === 1 ? 'lance' : 'lances'}
            </span>
            {auction.status === 'LIVE' ? (
              <Countdown target={auction.endsAt} className="font-semibold text-accent" />
            ) : (
              <StatusBadgeTime status={auction.status} />
            )}
          </div>
        </div>

        <span className="rounded-md border border-primary py-2 text-center text-sm font-medium text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          Ver Lote
        </span>
      </div>
    </Link>
  );
}

function StatusBadgeTime({ status }: { status: Auction['status'] }) {
  return (
    <span className="font-mono text-xs text-muted-foreground">
      {status === 'UPCOMING' ? 'Em breve' : '—'}
    </span>
  );
}
