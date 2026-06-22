import { cn } from '@/lib/utils';
import { STATUS_LABELS } from '@/lib/format';
import type { AuctionStatus } from '@/types';

const STYLES: Record<AuctionStatus, string> = {
  LIVE: 'bg-accent text-accent-foreground',
  UPCOMING: 'bg-accent-alt/20 text-amber-700',
  CLOSED: 'bg-secondary text-muted-foreground',
};

export function StatusBadge({ status, className }: { status: AuctionStatus; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
        STYLES[status],
        className,
      )}
    >
      {status === 'LIVE' && (
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-current" />
        </span>
      )}
      {STATUS_LABELS[status]}
    </span>
  );
}
