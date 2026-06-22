export type Role = 'USER' | 'AUCTIONEER';
export type Category = 'IMOVEL' | 'VEICULO' | 'OUTROS';
export type AuctionStatus = 'UPCOMING' | 'LIVE' | 'CLOSED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuctioneerSummary {
  id: string;
  name: string;
}

export interface Auction {
  id: string;
  title: string;
  description: string;
  category: Category;
  images: string[];
  city: string;
  state: string;
  startPrice: string;
  currentBid: string;
  appraisal: string | null;
  startsAt: string;
  endsAt: string;
  status: AuctionStatus;
  auctioneer: AuctioneerSummary;
  auctioneerId: string;
  _count?: { bids: number };
}

export interface Bid {
  id: string;
  value: string;
  userId: string;
  auctionId: string;
  createdAt: string;
  user?: { id: string; name: string };
}

export interface UserBid extends Bid {
  auction: Pick<Auction, 'id' | 'title' | 'status' | 'currentBid' | 'endsAt' | 'images'>;
}

export interface Favorite {
  id: string;
  auctionId: string;
  createdAt: string;
  auction: Auction;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CategoryOption {
  value: Category;
  label: string;
}

export interface SearchResult {
  id: string;
  title: string;
  category: Category;
  city: string;
  state: string;
  status: AuctionStatus;
  currentBid: string;
  images: string[];
}
