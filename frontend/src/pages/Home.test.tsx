import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';
import { Home } from './Home';

vi.mock('@/services/auctions.api', () => ({
  listAuctions: vi.fn().mockResolvedValue({ items: [], page: 1, limit: 8, total: 0, totalPages: 1 }),
}));

function renderHome() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('Home', () => {
  it('renders the hero headline', () => {
    renderHome();
    expect(
      screen.getByRole('heading', { name: /Arremate imóveis, veículos e oportunidades/i }),
    ).toBeInTheDocument();
  });
});
