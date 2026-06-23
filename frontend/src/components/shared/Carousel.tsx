import { Children, useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CarouselProps {
  children: ReactNode;
  /** Tailwind `basis-*` classes controlling how many cards show per view. */
  itemClassName?: string;
  className?: string;
  ariaLabel?: string;
}

// Default: ~1 card on mobile (with a peek), 2 on sm, 4 on lg. The calc values
// subtract the gap-5 (1.25rem) gutters so the cards line up edge to edge.
const DEFAULT_ITEM =
  'basis-[85%] sm:basis-[calc((100%-1.25rem)/2)] lg:basis-[calc((100%-3.75rem)/4)]';

/**
 * Horizontal, scroll-snapping carousel with prev/next arrows. Wraps each child
 * in a snap item; arrows appear only when there is room to scroll that way.
 * Falls back to native touch/trackpad scrolling on mobile.
 */
export function Carousel({ children, itemClassName = DEFAULT_ITEM, className, ariaLabel }: CarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const items = Children.toArray(children);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const update = () => {
      setCanPrev(el.scrollLeft > 4);
      setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [items.length]);

  const scrollByPage = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: 'smooth' });
  };

  return (
    <div className={cn('relative', className)}>
      <ul
        ref={trackRef}
        aria-label={ariaLabel}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((child, i) => (
          <li key={i} className={cn('min-w-0 shrink-0 snap-start [&>*]:h-full [&>*]:w-full', itemClassName)}>
            {child}
          </li>
        ))}
      </ul>

      {canPrev && (
        <CarouselArrow dir="prev" onClick={() => scrollByPage(-1)} />
      )}
      {canNext && (
        <CarouselArrow dir="next" onClick={() => scrollByPage(1)} />
      )}
    </div>
  );
}

function CarouselArrow({ dir, onClick }: { dir: 'prev' | 'next'; onClick: () => void }) {
  const isNext = dir === 'next';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isNext ? 'Próximos itens' : 'Itens anteriores'}
      className={cn(
        'absolute top-1/2 z-10 hidden size-10 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface text-ink shadow-card transition hover:text-brand-pink lg:grid',
        isNext ? '-right-3' : '-left-3',
      )}
    >
      {isNext ? <ChevronRight className="size-5" /> : <ChevronLeft className="size-5" />}
    </button>
  );
}
