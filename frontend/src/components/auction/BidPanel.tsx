import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from './StatusBadge';
import { Countdown } from './Countdown';
import { BidHistory } from './BidHistory';
import { placeBid } from '@/services/auctions.api';
import { ApiError } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { useToggleFavorite } from '@/hooks/useFavorites';
import { useUiStore } from '@/store/ui.store';
import { formatCurrency, minimumNextBid } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Auction } from '@/types';

export function BidPanel({ auction }: { auction: Auction }) {
  const { isAuthenticated, user } = useAuth();
  const openAuth = useUiStore((s) => s.openAuth);
  const queryClient = useQueryClient();
  const minNext = minimumNextBid(auction.currentBid);
  const [value, setValue] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);

  const isOwner = user?.id === auction.auctioneerId;
  const isLive = auction.status === 'LIVE';

  const { isFavorited, toggle, isPending: favPending } = useToggleFavorite(auction.id);

  const mutation = useMutation({
    mutationFn: (amount: number) => placeBid(auction.id, amount),
    onSuccess: () => {
      toast.success('Lance enviado!');
      setValue('');
      setFieldError(null);
      queryClient.invalidateQueries({ queryKey: ['auction', auction.id] });
      queryClient.invalidateQueries({ queryKey: ['auction', auction.id, 'bids'] });
    },
    onError: (err) => {
      const msg = err instanceof ApiError ? err.message : 'Falha ao dar lance';
      setFieldError(msg);
      toast.error(msg);
    },
  });

  function submitBid(e: React.FormEvent) {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuth('login');
      return;
    }
    const amount = Number(value);
    if (!amount || amount < minNext) {
      setFieldError(`O lance mínimo é ${formatCurrency(minNext)}`);
      return;
    }
    mutation.mutate(amount);
  }

  function share() {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: auction.title, url }).catch(() => undefined);
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copiado!');
    }
  }

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${auction.title} — ${window.location.href}`)}`;

  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <StatusBadge status={auction.status} />
        {isLive ? (
          <Countdown target={auction.endsAt} className="text-lg font-bold text-accent" />
        ) : null}
      </div>

      <div>
        <span className="block text-sm text-muted-foreground">Lance atual</span>
        <span className="font-mono text-3xl font-extrabold text-primary">
          {formatCurrency(auction.currentBid)}
        </span>
      </div>

      {isLive && !isOwner && (
        <form onSubmit={submitBid} className="space-y-2" noValidate>
          <label htmlFor="bid-input" className="text-sm text-muted-foreground">
            Lance mínimo: <span className="font-mono">{formatCurrency(minNext)}</span>
          </label>
          <div className="flex gap-2">
            <Input
              id="bid-input"
              type="number"
              inputMode="decimal"
              step="0.01"
              min={minNext}
              placeholder={String(minNext)}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setFieldError(null);
              }}
              className="font-mono"
            />
            <Button type="submit" disabled={mutation.isPending} className="bg-accent hover:bg-accent/90">
              {mutation.isPending ? 'Enviando...' : 'Dar Lance'}
            </Button>
          </div>
          {fieldError && <p className="text-sm text-destructive">{fieldError}</p>}
        </form>
      )}

      {isLive && isOwner && (
        <p className="rounded-md bg-secondary p-3 text-sm text-muted-foreground">
          Você é o leiloeiro deste lote e não pode dar lances.
        </p>
      )}

      {!isLive && (
        <p className="rounded-md bg-secondary p-3 text-sm text-muted-foreground">
          {auction.status === 'UPCOMING'
            ? 'Este leilão ainda não começou.'
            : 'Este leilão está encerrado.'}
        </p>
      )}

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1 gap-2"
          onClick={() => (isAuthenticated ? toggle() : openAuth('login'))}
          disabled={favPending}
        >
          <Heart className={cn('size-4', isFavorited && 'fill-accent text-accent')} />
          {isFavorited ? 'Favoritado' : 'Favoritar'}
        </Button>
        <Button type="button" variant="outline" className="gap-2" onClick={share}>
          <Share2 className="size-4" /> Compartilhar
        </Button>
        <Button asChild variant="outline" size="icon" aria-label="Compartilhar no WhatsApp">
          <a href={whatsappUrl} target="_blank" rel="noreferrer">
            <MessageCircle className="size-4" />
          </a>
        </Button>
      </div>

      <div className="border-t border-border pt-4">
        <h3 className="mb-2 text-sm font-semibold text-text-primary">Lances recentes</h3>
        <BidHistory auctionId={auction.id} />
      </div>

      <p className="text-xs text-muted-foreground">
        Leiloeiro: <span className="font-medium text-text-primary">{auction.auctioneer.name}</span>
      </p>
    </div>
  );
}
