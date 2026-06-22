import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from './StatusBadge';
import { CategoryBadge } from './CategoryBadge';
import { CountdownBoxes } from './CountdownBoxes';
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
    <div className="space-y-5 rounded-2xl border border-line bg-surface p-5 shadow-card">
      <div className="flex items-center justify-between">
        <CategoryBadge category={auction.category} className="shadow-none" />
        <StatusBadge status={auction.status} />
      </div>

      <div>
        <span className="block text-sm text-muted-foreground">Lance atual</span>
        <span className="font-display text-3xl font-bold tabular-nums text-ink">
          {formatCurrency(auction.currentBid)}
        </span>
      </div>

      {isLive && (
        <div className="rounded-xl bg-bg p-3">
          <p className="mb-2 text-xs text-muted-foreground">Encerra em</p>
          <CountdownBoxes target={auction.endsAt} />
        </div>
      )}

      {isLive && !isOwner && (
        <form onSubmit={submitBid} className="space-y-2" noValidate>
          <label htmlFor="bid-input" className="block text-sm text-muted-foreground">
            Próximo lance mínimo:{' '}
            <span className="font-semibold tabular-nums text-ink">{formatCurrency(minNext)}</span>
          </label>
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
            className="h-11 rounded-xl tabular-nums"
            aria-invalid={fieldError ? true : undefined}
            aria-describedby={fieldError ? 'bid-error' : undefined}
          />
          <Button
            type="submit"
            variant="gradient"
            size="lg"
            disabled={mutation.isPending}
            className="w-full"
          >
            {mutation.isPending ? 'Enviando...' : 'Dar lance'}
          </Button>
          {fieldError && (
            <p id="bid-error" role="alert" className="text-sm text-destructive">
              {fieldError}
            </p>
          )}
        </form>
      )}

      {isLive && isOwner && (
        <p className="rounded-xl bg-secondary p-3 text-sm text-muted-foreground">
          Você é o leiloeiro deste lote e não pode dar lances.
        </p>
      )}

      {!isLive && (
        <p className="rounded-xl bg-secondary p-3 text-sm text-muted-foreground">
          {auction.status === 'UPCOMING'
            ? 'Este leilão ainda não começou.'
            : 'Este leilão está encerrado.'}
        </p>
      )}

      <div className="space-y-2">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full gap-2"
          onClick={() => (isAuthenticated ? toggle() : openAuth('login'))}
          disabled={favPending}
        >
          <Heart className={cn('size-4', isFavorited && 'fill-brand-pink text-brand-pink')} />
          {isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        </Button>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" className="flex-1 gap-2" onClick={share}>
            <Share2 className="size-4" /> Compartilhar
          </Button>
          <Button asChild variant="ghost" size="icon" aria-label="Compartilhar no WhatsApp">
            <a href={whatsappUrl} target="_blank" rel="noreferrer">
              <MessageCircle className="size-4" />
            </a>
          </Button>
        </div>
      </div>

      <div className="border-t border-line pt-4">
        <h3 className="mb-2 text-sm font-semibold text-ink">Lances recentes</h3>
        <BidHistory auctionId={auction.id} />
      </div>

      <p className="text-xs text-muted-foreground">
        Leiloeiro: <span className="font-medium text-ink">{auction.auctioneer.name}</span>
      </p>
    </div>
  );
}
