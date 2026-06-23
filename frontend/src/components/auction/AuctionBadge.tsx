import { cn } from '@/lib/utils';
import type { BadgeKind } from '@/lib/auctionBadge';

const BADGE_COPY: Record<BadgeKind, string> = {
  disputed: '🔥 Mais disputado',
  'ending-soon': '⏳ Encerrando hoje',
  deal: '⚡ Oportunidade',
  new: '🆕 Novo',
};

const BADGE_STYLES: Record<BadgeKind, string> = {
  disputed: 'bg-destructive text-white',
  'ending-soon': 'bg-brand-pink text-white',
  deal: 'bg-amber-400 text-ink',
  new: 'bg-blue-500 text-white',
};

export function AuctionBadge({ kind, className }: { kind: BadgeKind; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold shadow-card',
        BADGE_STYLES[kind],
        className,
      )}
    >
      {BADGE_COPY[kind]}
    </span>
  );
}
