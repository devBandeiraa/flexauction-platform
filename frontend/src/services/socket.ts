import { io, type Socket } from 'socket.io-client';

export interface BidNewPayload {
  loteId: string;
  valor: number;
  totalLances: number;
  encerraEm: string;
}

export interface AuctionClosedPayload {
  loteId: string;
  vencedorId: string | null;
  valorFinal: number;
}

export interface AuctionExtendedPayload {
  loteId: string;
  novoEncerramento: string;
}

interface ServerToClientEvents {
  'bid:new': (payload: BidNewPayload) => void;
  'auction:closed': (payload: AuctionClosedPayload) => void;
  'auction:extended': (payload: AuctionExtendedPayload) => void;
}

interface ClientToServerEvents {
  'auction:watch': (data: { loteId: string }) => void;
  'auction:unwatch': (data: { loteId: string }) => void;
}

export type AuctionSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? 'http://localhost:3001';

let socket: AuctionSocket | null = null;

export function getSocket(): AuctionSocket {
  socket ??= io(SOCKET_URL, { autoConnect: true, transports: ['websocket'] });
  return socket;
}

export function watchAuction(loteId: string): void {
  getSocket().emit('auction:watch', { loteId });
}

export function unwatchAuction(loteId: string): void {
  getSocket().emit('auction:unwatch', { loteId });
}
