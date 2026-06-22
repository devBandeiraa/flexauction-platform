import { apiFetch } from './api';
import type {
  Auction,
  Bid,
  CategoryOption,
  Paginated,
  SearchResult,
} from '@/types';

export interface AuctionListParams {
  category?: string;
  status?: string;
  state?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  q?: string;
  page?: number;
  limit?: number;
}

function toQueryString(params: AuctionListParams): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '' && value !== null) {
      search.set(key, String(value));
    }
  }
  const str = search.toString();
  return str ? `?${str}` : '';
}

export function listAuctions(params: AuctionListParams = {}): Promise<Paginated<Auction>> {
  return apiFetch<Paginated<Auction>>(`/auctions${toQueryString(params)}`, { auth: false });
}

export function getAuction(id: string): Promise<Auction> {
  return apiFetch<Auction>(`/auctions/${id}`, { auth: false });
}

export function getAuctionBids(id: string): Promise<Bid[]> {
  return apiFetch<Bid[]>(`/auctions/${id}/bids`, { auth: false });
}

export function placeBid(id: string, value: number): Promise<Bid> {
  return apiFetch<Bid>(`/auctions/${id}/bids`, { method: 'POST', body: { value } });
}

export function getCategories(): Promise<CategoryOption[]> {
  return apiFetch<CategoryOption[]>('/categories', { auth: false });
}

export function searchAuctions(q: string): Promise<SearchResult[]> {
  return apiFetch<SearchResult[]>(`/search?q=${encodeURIComponent(q)}`, { auth: false });
}
