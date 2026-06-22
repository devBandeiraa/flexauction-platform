import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import { SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FilterBar } from '@/components/auction/FilterBar';
import { AuctionCard } from '@/components/auction/AuctionCard';
import { AuctionGridSkeleton } from '@/components/auction/AuctionCardSkeleton';
import { listAuctions, type AuctionListParams } from '@/services/auctions.api';

const PAGE_SIZE = 12;

function paramsToFilters(params: URLSearchParams): AuctionListParams {
  const filters: AuctionListParams = {};
  const category = params.get('categoria');
  const state = params.get('uf');
  const status = params.get('status');
  const min = params.get('min');
  const max = params.get('max');
  const q = params.get('q');
  if (category) filters.category = category;
  if (state) filters.state = state;
  if (status) filters.status = status;
  if (min) filters.minPrice = Number(min);
  if (max) filters.maxPrice = Number(max);
  if (q) filters.q = q;
  return filters;
}

export function Search() {
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => paramsToFilters(params), [params]);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['auctions', 'search', filters],
      queryFn: ({ pageParam }) => listAuctions({ ...filters, page: pageParam, limit: PAGE_SIZE }),
      initialPageParam: 1,
      getNextPageParam: (last) => (last.page < last.totalPages ? last.page + 1 : undefined),
    });

  const items = data?.pages.flatMap((p) => p.items) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: '300px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold text-text-primary">Leilões</h1>
      <FilterBar />

      <p className="mb-6 mt-4 text-sm text-muted-foreground">
        {isLoading ? 'Buscando...' : `${total} ${total === 1 ? 'resultado' : 'resultados'}`}
      </p>

      {isLoading ? (
        <AuctionGridSkeleton count={8} />
      ) : isError ? (
        <EmptyState
          title="Não foi possível carregar os leilões"
          subtitle="Tente novamente em instantes."
        />
      ) : items.length === 0 ? (
        <EmptyState
          title="Nenhum lote encontrado"
          subtitle="Ajuste ou limpe os filtros para ver mais resultados."
          action={
            <Button variant="outline" onClick={() => setParams(new URLSearchParams())}>
              Limpar filtros
            </Button>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
          <div ref={sentinelRef} className="h-10" />
          {isFetchingNextPage && (
            <p className="py-4 text-center text-sm text-muted-foreground">Carregando mais...</p>
          )}
        </>
      )}
    </div>
  );
}

function EmptyState({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
      <SearchX className="size-10 text-muted-foreground" />
      <div>
        <p className="font-semibold text-text-primary">{title}</p>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}
