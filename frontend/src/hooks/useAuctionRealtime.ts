import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getSocket,
  unwatchAuction,
  watchAuction,
  type AuctionClosedPayload,
  type AuctionExtendedPayload,
  type BidNewPayload,
} from '@/services/socket';
import type { Auction, Bid } from '@/types';

/**
 * Subscribes to a single auction's room and keeps the React Query cache in
 * sync with live bid/extension/closing events. Surfaces an "outbid" toast
 * when an incoming bid overtakes one the current user was leading.
 */
export function useAuctionRealtime(auctionId: string, currentUserId?: string): void {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getSocket();
    watchAuction(auctionId);

    const onBidNew = (payload: BidNewPayload) => {
      if (payload.loteId !== auctionId) return;

      const bids = queryClient.getQueryData<Bid[]>(['auction', auctionId, 'bids']);
      const previousTop = bids?.[0];
      if (
        currentUserId &&
        previousTop?.userId === currentUserId &&
        payload.valor > Number(previousTop.value)
      ) {
        toast.warning('Seu lance foi superado!');
      }

      queryClient.setQueryData<Auction>(['auction', auctionId], (old) =>
        old
          ? {
              ...old,
              currentBid: String(payload.valor),
              endsAt: payload.encerraEm,
              _count: { bids: payload.totalLances },
            }
          : old,
      );
      queryClient.invalidateQueries({ queryKey: ['auction', auctionId, 'bids'] });
    };

    const onExtended = (payload: AuctionExtendedPayload) => {
      if (payload.loteId !== auctionId) return;
      queryClient.setQueryData<Auction>(['auction', auctionId], (old) =>
        old ? { ...old, endsAt: payload.novoEncerramento } : old,
      );
      toast.info('Tempo estendido! Um lance foi dado nos últimos minutos.');
    };

    const onClosed = (payload: AuctionClosedPayload) => {
      if (payload.loteId !== auctionId) return;
      queryClient.setQueryData<Auction>(['auction', auctionId], (old) =>
        old ? { ...old, status: 'CLOSED' } : old,
      );
      toast.info('Leilão encerrado.');
    };

    socket.on('bid:new', onBidNew);
    socket.on('auction:extended', onExtended);
    socket.on('auction:closed', onClosed);

    return () => {
      unwatchAuction(auctionId);
      socket.off('bid:new', onBidNew);
      socket.off('auction:extended', onExtended);
      socket.off('auction:closed', onClosed);
    };
  }, [auctionId, currentUserId, queryClient]);
}
