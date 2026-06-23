import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin } from 'lucide-react';
import { AuctionImage } from '@/components/auction/AuctionImage';
import { CountdownBoxes } from '@/components/auction/CountdownBoxes';
import { Skeleton } from '@/components/ui/skeleton';
import { Reveal } from '@/components/shared/Reveal';
import { Carousel } from '@/components/shared/Carousel';
import { listAuctions } from '@/services/auctions.api';
import { formatCurrency } from '@/lib/format';
import { onlineCount } from '@/lib/livePresence';
import type { Auction } from '@/types';

function byEndingSoonest(a: Auction, b: Auction) {
  return new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime();
}

export function LiveAuctionsSection() {
  const { data, isLoading } = useQuery({
    queryKey: ['auctions', { status: 'LIVE', limit: 12 }],
    queryFn: () => listAuctions({ status: 'LIVE', limit: 12 }),
  });

  const live = [...(data?.items ?? [])].sort(byEndingSoonest);

  if (!isLoading && live.length === 0) return null;

  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <Reveal className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-destructive opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-destructive" />
            </span>
            <h2 className="text-2xl font-bold text-ink">Leilões ao vivo</h2>
          </div>
          <Link
            to="/leiloes?status=LIVE"
            className="text-sm font-medium text-brand-pink transition-colors hover:text-brand-orange"
          >
            Ver todos
          </Link>
        </Reveal>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-44 rounded-2xl" />
            ))}
          </div>
        ) : (
          <Carousel ariaLabel="Leilões ao vivo">
            {live.map((auction) => (
              <Link
                key={auction.id}
                to={`/leilao/${auction.id}`}
                className="group flex flex-col gap-3 rounded-2xl border border-line bg-bg p-3 shadow-card transition hover:-translate-y-1 hover:shadow-card-hover"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
                  <AuctionImage
                    images={auction.images}
                    alt={auction.title}
                    category={auction.category}
                    className="size-full transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1.5 rounded-full bg-destructive px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide text-destructive-foreground">
                    <span className="relative flex size-1.5">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-75" />
                      <span className="relative inline-flex size-1.5 rounded-full bg-white" />
                    </span>
                    Ao vivo
                  </span>
                  <span className="absolute right-2 top-2 rounded-full bg-ink-deep/70 px-2 py-0.5 text-[0.625rem] font-medium text-white backdrop-blur-sm">
                    {onlineCount(auction.id)} online
                  </span>
                </div>
                <h3 className="line-clamp-1 font-display text-sm font-semibold text-ink">
                  {auction.title}
                </h3>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3 shrink-0" />
                  {auction.city}/{auction.state}
                </p>
                <div>
                  <span className="block text-[0.625rem] uppercase tracking-wide text-muted-foreground">
                    Maior lance
                  </span>
                  <p className="font-display text-lg font-bold tabular-nums text-ink">
                    {formatCurrency(auction.currentBid)}
                  </p>
                </div>
                <CountdownBoxes target={auction.endsAt} size="sm" shape="circle" className="justify-center" />
                <span className="mt-1 rounded-xl bg-gradient-brand py-2 text-center text-sm font-semibold text-white transition group-hover:brightness-105">
                  Dar Lance
                </span>
              </Link>
            ))}
          </Carousel>
        )}
      </div>
    </section>
  );
}
