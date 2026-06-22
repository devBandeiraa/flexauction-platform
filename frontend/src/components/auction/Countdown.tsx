import { useEffect, useRef } from 'react';
import { useCountdown } from '@/hooks/useCountdown';
import { formatCountdown } from '@/lib/format';
import { cn } from '@/lib/utils';

interface CountdownProps {
  target: string;
  className?: string;
  onComplete?: () => void;
}

export function Countdown({ target, className, onComplete }: CountdownProps) {
  const remaining = useCountdown(target);
  const fired = useRef(false);

  useEffect(() => {
    if (remaining <= 0 && !fired.current) {
      fired.current = true;
      onComplete?.();
    }
  }, [remaining, onComplete]);

  if (remaining <= 0) {
    return <span className={cn('font-mono', className)}>Encerrado</span>;
  }

  return (
    <span className={cn('font-mono tabular-nums', className)}>{formatCountdown(remaining)}</span>
  );
}
