import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it } from 'vitest';
import { AuctionCard } from './AuctionCard';
import type { Auction } from '@/types';

const baseAuction: Auction = {
  id: 'a1',
  title: 'Apartamento 3 quartos',
  description: 'Descrição',
  category: 'IMOVEL',
  images: [],
  city: 'São Paulo',
  state: 'SP',
  startPrice: '350000',
  currentBid: '400000',
  appraisal: '800000',
  startsAt: new Date(Date.now() - 3600_000).toISOString(),
  endsAt: new Date(Date.now() + 3600_000).toISOString(),
  createdAt: new Date(Date.now() - 7 * 24 * 3600_000).toISOString(),
  status: 'LIVE',
  auctioneer: { id: 'au1', name: 'Casa de Leilões' },
  auctioneerId: 'au1',
  _count: { bids: 5 },
};

function renderCard(auction: Auction) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <AuctionCard auction={auction} />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('AuctionCard', () => {
  it('shows title, location and formatted current bid', () => {
    renderCard(baseAuction);
    expect(screen.getByText('Apartamento 3 quartos')).toBeInTheDocument();
    expect(screen.getByText('São Paulo/SP')).toBeInTheDocument();
    expect(screen.getByText('R$ 400.000,00')).toBeInTheDocument();
  });

  it('shows the bid count and links to the lot', () => {
    renderCard(baseAuction);
    expect(screen.getByText('5 lances')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/leilao/a1');
  });

  it('shows a discount badge when the bid is below the appraisal', () => {
    renderCard(baseAuction);
    // 400000 vs 800000 appraisal -> 50%
    expect(screen.getByText('50% abaixo do avaliado')).toBeInTheDocument();
  });

  it('omits the discount badge without an appraisal', () => {
    renderCard({ ...baseAuction, appraisal: null });
    expect(screen.queryByText(/abaixo do avaliado/)).not.toBeInTheDocument();
  });
});
