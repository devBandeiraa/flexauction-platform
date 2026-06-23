import { describe, expect, it } from 'vitest';
import { pickBadge } from './auctionBadge';
import type { Auction } from '@/types';

const base: Auction = {
  id: 'a1',
  title: 'Lote',
  description: '',
  category: 'IMOVEL',
  images: [],
  city: 'São Paulo',
  state: 'SP',
  startPrice: '100',
  currentBid: '100',
  appraisal: null,
  startsAt: new Date(Date.now() - 3600_000).toISOString(),
  endsAt: new Date(Date.now() + 10 * 24 * 3600_000).toISOString(),
  createdAt: new Date(Date.now() - 30 * 24 * 3600_000).toISOString(),
  status: 'LIVE',
  auctioneer: { id: 'au1', name: 'Casa de Leilões' },
  auctioneerId: 'au1',
};

describe('pickBadge', () => {
  it('returns "disputed" when flagged as most-bid and it has at least one bid', () => {
    const auction = { ...base, _count: { bids: 5 } };
    expect(pickBadge(auction, true)).toBe('disputed');
  });

  it('does not return "disputed" for a zero-bid auction even if flagged as most-bid', () => {
    const auction = { ...base, _count: { bids: 0 } };
    expect(pickBadge(auction, true)).toBe(null);
  });

  it('returns "ending-soon" when less than 24h remain', () => {
    const auction = { ...base, endsAt: new Date(Date.now() + 3600_000).toISOString() };
    expect(pickBadge(auction, false)).toBe('ending-soon');
  });

  it('returns "deal" when the discount is at least 30%', () => {
    const auction = { ...base, currentBid: '500', appraisal: '1000' };
    expect(pickBadge(auction, false)).toBe('deal');
  });

  it('returns "new" when created within the last 48h', () => {
    const auction = { ...base, createdAt: new Date(Date.now() - 3600_000).toISOString() };
    expect(pickBadge(auction, false)).toBe('new');
  });

  it('returns null when no rule matches', () => {
    expect(pickBadge(base, false)).toBe(null);
  });

  it('prioritizes ending-soon over deal', () => {
    const auction = {
      ...base,
      endsAt: new Date(Date.now() + 3600_000).toISOString(),
      currentBid: '500',
      appraisal: '1000',
    };
    expect(pickBadge(auction, false)).toBe('ending-soon');
  });
});
