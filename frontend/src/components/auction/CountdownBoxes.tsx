import { useCountdown } from '@/hooks/useCountdown';
import { cn } from '@/lib/utils';

interface CountdownBoxesProps {
  target: string;
  /** Visual size of the digit boxes. */
  size?: 'sm' | 'md';
  className?: string;
}

const BOXES = [
  { key: 'h', label: 'Horas' },
  { key: 'm', label: 'Min' },
  { key: 's', label: 'Seg' },
] as const;

/** HH : MM : SS countdown rendered as labelled, tabular-nums boxes. */
export function CountdownBoxes({ target, size = 'md', className }: CountdownBoxesProps) {
  const remaining = Math.max(0, useCountdown(target));
  const totalSeconds = Math.floor(remaining / 1000);
  const values = {
    h: Math.floor(totalSeconds / 3600),
    m: Math.floor((totalSeconds % 3600) / 60),
    s: totalSeconds % 60,
  };
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className={cn('flex items-start gap-1.5', className)} role="timer" aria-label="Tempo restante">
      {BOXES.map((box, i) => (
        <div key={box.key} className="flex items-start gap-1.5">
          <div className="flex flex-col items-center">
            <span
              className={cn(
                'grid place-items-center rounded-lg bg-secondary font-display font-bold tabular-nums text-ink',
                size === 'sm' ? 'h-9 w-9 text-base' : 'h-11 w-11 text-lg',
              )}
            >
              {pad(values[box.key])}
            </span>
            <span className="mt-1 text-[0.625rem] font-medium uppercase tracking-wide text-muted-foreground">
              {box.label}
            </span>
          </div>
          {i < BOXES.length - 1 && (
            <span className={cn('font-display font-bold text-muted-foreground', size === 'sm' ? 'leading-9' : 'leading-[2.75rem]')}>
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
