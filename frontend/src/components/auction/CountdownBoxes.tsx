import { useCountdown } from '@/hooks/useCountdown';
import { cn } from '@/lib/utils';

interface CountdownBoxesProps {
  target: string;
  /** Visual size of the digit boxes. */
  size?: 'sm' | 'md';
  /** `light` (default) for light surfaces, `dark` for boxes over dark/glass. */
  variant?: 'light' | 'dark';
  className?: string;
}

const BOXES = [
  { key: 'd', label: 'Dias' },
  { key: 'h', label: 'Horas' },
  { key: 'm', label: 'Min' },
  { key: 's', label: 'Seg' },
] as const;

const URGENT_THRESHOLD_MS = 24 * 60 * 60 * 1000;

/** DD : HH : MM : SS countdown rendered as labelled, tabular-nums boxes. Turns red and pulses under 24h. */
export function CountdownBoxes({ target, size = 'md', variant = 'light', className }: CountdownBoxesProps) {
  const remaining = Math.max(0, useCountdown(target));
  const urgent = remaining > 0 && remaining < URGENT_THRESHOLD_MS;
  const totalSeconds = Math.floor(remaining / 1000);
  const values = {
    d: Math.floor(totalSeconds / 86400),
    h: Math.floor((totalSeconds % 86400) / 3600),
    m: Math.floor((totalSeconds % 3600) / 60),
    s: totalSeconds % 60,
  };
  const pad = (n: number) => String(n).padStart(2, '0');
  const dark = variant === 'dark';
  const idleBox = dark ? 'bg-white/10 text-white' : 'bg-secondary text-ink';
  const labelColor = dark ? 'text-white/60' : 'text-muted-foreground';
  const colonColor = dark ? 'text-white/40' : 'text-muted-foreground';

  return (
    <div
      className={cn('flex items-start gap-1.5', urgent && 'animate-pulse', className)}
      role="timer"
      aria-label="Tempo restante"
    >
      {BOXES.map((box, i) => (
        <div key={box.key} className="flex items-start gap-1.5">
          <div className="flex flex-col items-center">
            <span
              className={cn(
                'grid place-items-center rounded-lg font-display font-bold tabular-nums',
                urgent ? 'bg-destructive text-destructive-foreground' : idleBox,
                size === 'sm' ? 'h-9 w-9 text-base' : 'h-11 w-11 text-lg',
              )}
            >
              {pad(values[box.key])}
            </span>
            <span className={cn('mt-1 text-[0.625rem] font-medium uppercase tracking-wide', labelColor)}>
              {box.label}
            </span>
          </div>
          {i < BOXES.length - 1 && (
            <span className={cn('font-display font-bold', colonColor, size === 'sm' ? 'leading-9' : 'leading-[2.75rem]')}>
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
