import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { getAuctionBids } from '@/services/auctions.api';
import { formatCurrency, formatDateTime } from '@/lib/format';

export function BidHistory({ auctionId }: { auctionId: string }) {
  const { data: bids, isLoading } = useQuery({
    queryKey: ['auction', auctionId, 'bids'],
    queryFn: () => getAuctionBids(auctionId),
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (!bids || bids.length === 0) {
    return <p className="py-6 text-center text-sm text-muted-foreground">Nenhum lance ainda. Seja o primeiro!</p>;
  }

  return (
    <ul className="divide-y divide-border">
      {bids.map((bid, index) => (
        <li key={bid.id} className="flex items-center justify-between py-2.5">
          <div className="min-w-0">
            <span className="block truncate text-sm font-medium text-text-primary">
              {bid.user?.name ?? 'Participante'}
            </span>
            <span className="text-xs text-muted-foreground">{formatDateTime(bid.createdAt)}</span>
          </div>
          <span
            className={`shrink-0 font-mono text-sm font-semibold ${
              index === 0 ? 'text-success' : 'text-text-primary'
            }`}
          >
            {formatCurrency(bid.value)}
          </span>
        </li>
      ))}
    </ul>
  );
}
