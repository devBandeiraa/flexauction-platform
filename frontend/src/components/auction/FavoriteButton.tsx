import { Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToggleFavorite } from '@/hooks/useFavorites';
import { useUiStore } from '@/store/ui.store';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  auctionId: string;
  className?: string;
}

/**
 * Circular favourite (heart) toggle for use over a card image. Opens the auth
 * modal for guests; otherwise toggles the favourite. Stops propagation so it
 * never triggers the surrounding card link.
 */
export function FavoriteButton({ auctionId, className }: FavoriteButtonProps) {
  const { isAuthenticated } = useAuth();
  const openAuth = useUiStore((s) => s.openAuth);
  const { isFavorited, toggle, isPending } = useToggleFavorite(auctionId);

  return (
    <button
      type="button"
      aria-label={isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      aria-pressed={isFavorited}
      disabled={isPending}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isAuthenticated) toggle();
        else openAuth('login');
      }}
      className={cn(
        'grid size-9 place-items-center rounded-full bg-surface/90 text-ink-soft shadow-card backdrop-blur transition hover:bg-surface hover:text-brand-pink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink focus-visible:ring-offset-2 disabled:opacity-60',
        className,
      )}
    >
      <Heart className={cn('size-4 transition-colors', isFavorited && 'fill-brand-pink text-brand-pink')} />
    </button>
  );
}
