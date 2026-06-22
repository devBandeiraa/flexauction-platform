import { apiFetch } from './api';
import type { Favorite, UserBid } from '@/types';

export function getMyBids(): Promise<UserBid[]> {
  return apiFetch<UserBid[]>('/me/bids');
}

export function getMyFavorites(): Promise<Favorite[]> {
  return apiFetch<Favorite[]>('/me/favorites');
}

export function addFavorite(auctionId: string): Promise<void> {
  return apiFetch<void>(`/me/favorites/${auctionId}`, { method: 'POST' });
}

export function removeFavorite(auctionId: string): Promise<void> {
  return apiFetch<void>(`/me/favorites/${auctionId}`, { method: 'DELETE' });
}
