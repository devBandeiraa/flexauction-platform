import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';
import { Search } from './Search';
import { listAuctions } from '@/services/auctions.api';

vi.mock('@/services/auctions.api', () => ({
  listAuctions: vi.fn().mockResolvedValue({ items: [], page: 1, limit: 12, total: 0, totalPages: 1 }),
}));

function renderSearch(initialEntry: string) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Search />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('Search', () => {
  it('parses the "cidade" URL param and forwards it as "city" to listAuctions', () => {
    renderSearch('/leiloes?cidade=Curitiba');
    expect(listAuctions).toHaveBeenCalledWith(
      expect.objectContaining({ city: 'Curitiba' }),
    );
  });
});
