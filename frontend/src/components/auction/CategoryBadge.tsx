import { CATEGORY_LABELS } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Category } from '@/types';

/** Small category pill for overlaying a lot image. */
export function CategoryBadge({ category, className }: { category: Category; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-surface/90 px-2.5 py-1 text-xs font-semibold text-ink shadow-card backdrop-blur',
        className,
      )}
    >
      {CATEGORY_LABELS[category]}
    </span>
  );
}
