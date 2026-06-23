import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight } from 'lucide-react';
import { AuctionImage } from '@/components/auction/AuctionImage';
import { Skeleton } from '@/components/ui/skeleton';
import { Reveal } from '@/components/shared/Reveal';
import { listAuctions } from '@/services/auctions.api';
import { formatCurrency } from '@/lib/format';
import type { Auction } from '@/types';

interface Deal {
  auction: Auction;
  discount: number;
}

function withDiscount(auction: Auction): Deal | null {
  if (!auction.appraisal) return null;
  const bid = Number(auction.currentBid);
  const appraisal = Number(auction.appraisal);
  if (!appraisal || bid >= appraisal) return null;
  return { auction, discount: Math.round((1 - bid / appraisal) * 100) };
}

export function DealsOfDaySection() {
  const { data, isLoading } = useQuery({
    queryKey: ['auctions', { status: 'LIVE', limit: 8 }],
    queryFn: () => listAuctions({ status: 'LIVE', limit: 8 }),
  });

  const deals = (data?.items ?? [])
    .map(withDiscount)
    .filter((d): d is Deal => d !== null && d.discount > 0)
    .sort((a, b) => b.discount - a.discount)
    .slice(0, 4);

  if (!isLoading && deals.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1200px] px-6 py-16">
      <Reveal className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-ink">🔥 Oportunidades do dia</h2>
          <p className="mt-1 text-muted-foreground">Os maiores descontos em relação ao valor avaliado.</p>
        </div>
        <Link
          to="/leiloes?status=LIVE"
          className="shrink-0 text-sm font-medium text-brand-pink transition-colors hover:text-brand-orange"
        >
          Ver todos
        </Link>
      </Reveal>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="relative">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {deals.map(({ auction, discount }) => (
              <Link
                key={auction.id}
                to={`/leilao/${auction.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card transition hover:-translate-y-1 hover:shadow-card-hover"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <AuctionImage
                    images={auction.images}
                    alt={auction.title}
                    category={auction.category}
                    className="size-full transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-success px-2.5 py-1 text-xs font-bold text-success-foreground">
                    -{discount}%
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-1 p-4">
                  <h3 className="line-clamp-1 font-display text-sm font-semibold text-ink">
                    {auction.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Valor de mercado{' '}
                    <span className="line-through">{formatCurrency(auction.appraisal!)}</span>
                  </p>
                  <span className="mt-1 text-[0.625rem] uppercase tracking-wide text-muted-foreground">
                    Lance atual
                  </span>
                  <p className="font-display text-lg font-bold tabular-nums text-brand-pink">
                    {formatCurrency(auction.currentBid)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <Link
            to="/leiloes?status=LIVE"
            aria-label="Ver mais oportunidades"
            className="absolute -right-3 top-1/2 hidden size-10 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface text-ink shadow-card transition hover:text-brand-pink lg:grid"
          >
            <ChevronRight className="size-5" />
          </Link>
        </div>
      )}
    </section>
  );
}
