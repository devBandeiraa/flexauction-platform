import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  to: string;
  label: string;
  icon: LucideIcon;
  /** Number of lots in this category; renders "{n} lotes" when defined. */
  count?: number;
  className?: string;
}

/**
 * Category tile: icon + name + lot count. Gradient border + lift on hover via a
 * gradient backing layer revealed on hover.
 */
export function CategoryCard({ to, label, icon: Icon, count, className }: CategoryCardProps) {
  return (
    <Link
      to={to}
      className={cn(
        'group relative rounded-2xl p-[1px] transition-transform duration-200 hover:-translate-y-1',
        className,
      )}
    >
      {/* Gradient ring revealed on hover. */}
      <span className="absolute inset-0 rounded-2xl bg-gradient-brand opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      <span className="relative flex h-full flex-col items-center gap-2 rounded-2xl border border-line bg-surface px-4 py-6 text-center shadow-card">
        <span className="grid size-12 place-items-center rounded-full bg-brand-pink/10 text-brand-pink transition-colors group-hover:bg-brand-pink group-hover:text-white">
          <Icon className="size-6" />
        </span>
        <span className="font-display text-sm font-semibold text-ink">{label}</span>
        {count !== undefined && (
          <span className="text-xs text-muted-foreground">
            {count} {count === 1 ? 'lote' : 'lotes'}
          </span>
        )}
      </span>
    </Link>
  );
}
