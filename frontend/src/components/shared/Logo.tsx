import { cn } from '@/lib/utils';

interface LogoProps {
  /** Hide the "FlexAuction" wordmark and render only the flame mark. */
  iconOnly?: boolean;
  /** Render the wordmark for dark backgrounds (white "Auction"). */
  onDark?: boolean;
  className?: string;
}

/**
 * FlexAuction brand mark: a stylized flame/ribbon with a 3-stop cyan→pink→orange
 * gradient, paired with the "Flex" (pink) + "Auction" (ink) wordmark.
 *
 * If a real asset is later dropped in /public, swap <LogoMark /> for an <img>.
 */
export function Logo({ iconOnly = false, onDark = false, className }: LogoProps) {
  return (
    <span className={cn('flex items-center gap-2', className)}>
      <LogoMark className="size-8 shrink-0" />
      {!iconOnly && (
        <span className="font-display text-xl font-bold leading-none tracking-tight">
          <span className="text-brand-pink">Flex</span>
          <span className={onDark ? 'text-white' : 'text-ink-soft'}>Auction</span>
        </span>
      )}
    </span>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      role="img"
      aria-label="FlexAuction"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="fa-flame-back" x1="6" y1="36" x2="26" y2="4" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#22B8D6" />
          <stop offset="1" stopColor="#E5295E" />
        </linearGradient>
        <linearGradient id="fa-flame-front" x1="16" y1="36" x2="34" y2="4" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#E5295E" />
          <stop offset="1" stopColor="#FF7A3D" />
        </linearGradient>
      </defs>
      <rect
        x="8"
        y="5"
        width="11"
        height="30"
        rx="5.5"
        fill="url(#fa-flame-back)"
        transform="rotate(18 20 20)"
      />
      <rect
        x="18"
        y="5"
        width="11"
        height="30"
        rx="5.5"
        fill="url(#fa-flame-front)"
        transform="rotate(18 20 20)"
      />
    </svg>
  );
}
