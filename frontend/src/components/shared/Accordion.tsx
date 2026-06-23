import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AccordionItem {
  q: string;
  a: string;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
  /** Index open by default. Use -1 (default) for all closed. */
  defaultOpen?: number;
}

/**
 * Animated FAQ accordion. One panel open at a time, smooth height transition,
 * accessible button/region wiring. Matches the premium card styling of the home.
 */
export function Accordion({ items, className, defaultOpen = -1 }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={cn('space-y-3', className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.q}
            className={cn(
              'overflow-hidden rounded-2xl border bg-surface shadow-card transition-colors',
              isOpen ? 'border-brand-pink/40' : 'border-line',
            )}
          >
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-display font-semibold text-ink transition-colors hover:text-brand-pink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink focus-visible:ring-offset-2"
              >
                {item.q}
                <span
                  className={cn(
                    'grid size-7 shrink-0 place-items-center rounded-full transition-all duration-300',
                    isOpen ? 'rotate-45 bg-gradient-brand text-white' : 'bg-brand-pink/10 text-brand-pink',
                  )}
                >
                  <Plus className="size-4" />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
