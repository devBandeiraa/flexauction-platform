import { Link } from 'react-router-dom';
import { Gavel, MapPin } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { CategoryBadge } from './CategoryBadge';
import { FavoriteButton } from './FavoriteButton';
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
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-card-hover">
      <div className="relative aspect-[4/3] overflow-hidden">
        <AuctionImage
          images={auction.images}
          alt={auction.title}
          category={auction.category}
          className="size-full transition-transform duration-300 group-hover:scale-105"
        />

        <CategoryBadge category={auction.category} className="absolute left-3 top-3" />
        <FavoriteButton auctionId={auction.id} className="absolute right-3 top-3 z-10" />

        {auction.status === 'LIVE' && (
          <StatusBadge status={auction.status} className="absolute bottom-3 left-3" />
        )}
        {discount !== null && (
          <span className="absolute bottom-3 right-3 rounded-full bg-success px-2.5 py-1 text-xs font-semibold text-success-foreground">
            {discount}% abaixo do avaliado
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="line-clamp-2 font-display font-semibold text-ink">
          {/* Stretched link makes the whole card clickable while keeping the
              favourite button a sibling (valid, accessible markup). */}
          <Link to={`/leilao/${auction.id}`} className="after:absolute after:inset-0">
            {auction.title}
          </Link>
        </h3>

        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" />
          {auction.city}/{auction.state}
        </p>

        <div className="mt-auto space-y-2">
          <div>
            <span className="block text-xs text-muted-foreground">Lance atual</span>
            <span className="font-display text-xl font-bold tabular-nums text-ink">
              {formatCurrency(auction.currentBid)}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Gavel className="size-3.5" /> {bidCount} {bidCount === 1 ? 'lance' : 'lances'}
            </span>
            {auction.status === 'LIVE' ? (
              <Countdown target={auction.endsAt} className="font-semibold tabular-nums text-brand-pink" />
            ) : (
              <StatusBadgeTime status={auction.status} />
            )}
          </div>
        </div>

        <span className="rounded-xl bg-gradient-brand py-2 text-center text-sm font-semibold text-white transition group-hover:brightness-105">
          Ver lote
        </span>
      </div>
    </article>
  );
}

function StatusBadgeTime({ status }: { status: Auction['status'] }) {
  return (
    <span className="font-mono text-xs text-muted-foreground">
      {status === 'UPCOMING' ? 'Em breve' : '—'}
    </span>
  );
}
