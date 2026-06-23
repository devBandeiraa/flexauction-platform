import { useEffect, useRef, useState } from 'react';

/**
 * Animates from 0 to `end` once the returned ref scrolls into view, easing
 * out over `duration` ms. Respects prefers-reduced-motion by jumping straight
 * to `end` instead of animating.
 */
export function useCountUp<T extends HTMLElement>(end: number, duration = 1500) {
  const ref = useRef<T>(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const animate = () => {
      if (started.current) return;
      started.current = true;

      if (reduceMotion) {
        setValue(end);
        return;
      }

      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - (1 - progress) ** 3;
        setValue(Math.round(end * eased));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) animate();
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [end, duration]);

  return { ref, value };
}
