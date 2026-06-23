import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight } from 'lucide-react';
import { AuctionCard } from '@/components/auction/AuctionCard';
import { AuctionCardSkeleton } from '@/components/auction/AuctionCardSkeleton';
import { Reveal } from '@/components/shared/Reveal';
import { listAuctions } from '@/services/auctions.api';
import type { Auction } from '@/types';

function byMostBids(a: Auction, b: Auction) {
  return (b._count?.bids ?? 0) - (a._count?.bids ?? 0);
}

export function FeaturedAuctionsSection() {
  const { data, isLoading } = useQuery({
    queryKey: ['auctions', { status: 'LIVE', limit: 8 }],
    queryFn: () => listAuctions({ status: 'LIVE', limit: 8 }),
  });

  const featured = [...(data?.items ?? [])].sort(byMostBids).slice(0, 4);
  const topBidId = featured[0]?.id;

  return (
    <section className="mx-auto max-w-[1200px] px-6 pb-16 pt-16">
      <Reveal className="mb-6 flex items-end justify-between">
        <h2 className="text-2xl font-bold text-ink">Leilões em destaque</h2>
        <Link
          to="/leiloes?status=LIVE"
          className="text-sm font-medium text-brand-pink transition-colors hover:text-brand-orange"
        >
          Ver todos
        </Link>
      </Reveal>

      <div className="relative">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <AuctionCardSkeleton key={i} />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-line py-12 text-center text-muted-foreground">
            Nenhum leilão ao vivo no momento.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((auction) => (
                <AuctionCard key={auction.id} auction={auction} isMostBid={auction.id === topBidId} />
              ))}
            </div>
            <Link
              to="/leiloes?status=LIVE"
              aria-label="Ver mais leilões em destaque"
              className="absolute -right-3 top-1/2 hidden size-10 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface text-ink shadow-card transition hover:text-brand-pink lg:grid"
            >
              <ChevronRight className="size-5" />
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
