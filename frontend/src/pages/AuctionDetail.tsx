import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, MapPin } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Gallery } from '@/components/auction/Gallery';
import { BidPanel } from '@/components/auction/BidPanel';
import { getAuction } from '@/services/auctions.api';
import { useAuctionRealtime } from '@/hooks/useAuctionRealtime';
import { useAuth } from '@/hooks/useAuth';
import { CATEGORY_LABELS, formatCurrency } from '@/lib/format';

export function AuctionDetail() {
  const { id = '' } = useParams();
  const { user } = useAuth();

  const { data: auction, isLoading, isError } = useQuery({
    queryKey: ['auction', id],
    queryFn: () => getAuction(id),
    enabled: Boolean(id),
  });

  useAuctionRealtime(id, user?.id);

  if (isLoading) {
    return (
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[1fr_380px]">
        <Skeleton className="aspect-[4/3] w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError || !auction) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <p className="text-muted-foreground">Lote não encontrado.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/busca">Voltar para a busca</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Link
        to="/busca"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-accent"
      >
        <ArrowLeft className="size-4" /> Voltar
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <Gallery images={auction.images} title={auction.title} category={auction.category} />

          <div>
            <span className="text-sm font-medium text-accent">
              {CATEGORY_LABELS[auction.category]}
            </span>
            <h1 className="mt-1 text-2xl font-bold text-text-primary sm:text-3xl">
              {auction.title}
            </h1>
            <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="size-4" /> {auction.city}/{auction.state}
            </p>
          </div>

          {auction.appraisal && (
            <div className="flex gap-6 rounded-lg border border-border bg-card p-4">
              <div>
                <span className="block text-xs text-muted-foreground">Lance inicial</span>
                <span className="font-mono font-semibold text-text-primary">
                  {formatCurrency(auction.startPrice)}
                </span>
              </div>
              <div>
                <span className="block text-xs text-muted-foreground">Valor avaliado</span>
                <span className="font-mono font-semibold text-text-primary">
                  {formatCurrency(auction.appraisal)}
                </span>
              </div>
            </div>
          )}

          <div>
            <h2 className="mb-2 text-lg font-semibold text-text-primary">Descrição</h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-text-primary/80">
              {auction.description}
            </p>
          </div>
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <BidPanel auction={auction} />
        </aside>
      </div>
    </div>
  );
}
