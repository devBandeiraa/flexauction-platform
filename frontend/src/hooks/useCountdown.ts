import { useEffect, useState } from 'react';

/**
 * Returns the milliseconds remaining until `target`, ticking every second.
 * The interval is paused while the tab is hidden and resynced on return,
 * so a backgrounded tab never drifts or wastes timers.
 */
export function useCountdown(target: string | Date): number {
  const targetMs = typeof target === 'string' ? new Date(target).getTime() : target.getTime();
  const [remaining, setRemaining] = useState(() => targetMs - Date.now());

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    const tick = () => setRemaining(targetMs - Date.now());

    const start = () => {
      tick();
      interval = setInterval(tick, 1000);
    };

    const stop = () => {
      if (interval) clearInterval(interval);
      interval = undefined;
    };

    const onVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    };

    if (!document.hidden) start();
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [targetMs]);

  return remaining;
}
