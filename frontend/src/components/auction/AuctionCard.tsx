import { Link } from 'react-router-dom';
import { Clock, Gavel, MapPin } from 'lucide-react';
import { CategoryBadge } from './CategoryBadge';
import { FavoriteButton } from './FavoriteButton';
import { Countdown } from './Countdown';
import { AuctionImage } from './AuctionImage';
import { AuctionBadge } from './AuctionBadge';
import { pickBadge } from '@/lib/auctionBadge';
import { formatCurrency } from '@/lib/format';
import type { Auction } from '@/types';

interface AuctionCardProps {
  auction: Auction;
  /** Whether this card has the most bids among the cards currently on screen. */
  isMostBid?: boolean;
}

export function AuctionCard({ auction, isMostBid = false }: AuctionCardProps) {
  const bidCount = auction._count?.bids ?? 0;
  const badge = pickBadge(auction, isMostBid);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover">
      <div className="relative aspect-[4/3] overflow-hidden">
        <AuctionImage
          images={auction.images}
          alt={auction.title}
          category={auction.category}
          className="size-full transition-transform duration-500 ease-out group-hover:scale-110"
        />

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {badge ? <AuctionBadge kind={badge} /> : <CategoryBadge category={auction.category} />}
        </div>
        <FavoriteButton auctionId={auction.id} className="absolute right-3 top-3 z-10" />
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
              <span className="flex items-center gap-1 font-semibold text-destructive">
                <Clock className="size-3.5" />
                <Countdown target={auction.endsAt} className="tabular-nums" />
              </span>
            ) : (
              <StatusBadgeTime status={auction.status} />
            )}
          </div>
        </div>

        <span className="rounded-xl bg-gradient-brand py-2 text-center text-sm font-semibold text-white transition group-hover:brightness-105">
          Dar Lance
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
