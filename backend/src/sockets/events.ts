/** Shared Socket.IO event contracts between server and clients. */

export interface BidNewPayload {
  loteId: string;
  valor: number;
  totalLances: number;
  encerraEm: string; // ISO date
}

export interface AuctionClosedPayload {
  loteId: string;
  vencedorId: string | null;
  valorFinal: number;
}

export interface AuctionExtendedPayload {
  loteId: string;
  novoEncerramento: string; // ISO date
}

export interface ServerToClientEvents {
  'bid:new': (payload: BidNewPayload) => void;
  'auction:closed': (payload: AuctionClosedPayload) => void;
  'auction:extended': (payload: AuctionExtendedPayload) => void;
}

export interface ClientToServerEvents {
  'auction:watch': (data: { loteId: string }) => void;
  'auction:unwatch': (data: { loteId: string }) => void;
}

export const auctionRoom = (auctionId: string): string => `auction:${auctionId}`;
