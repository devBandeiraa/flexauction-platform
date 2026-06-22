import type { Server as HttpServer } from 'node:http';
import { Server } from 'socket.io';
import { logger } from '../config/logger.js';
import {
  auctionRoom,
  type AuctionClosedPayload,
  type AuctionExtendedPayload,
  type BidNewPayload,
  type ClientToServerEvents,
  type ServerToClientEvents,
} from './events.js';

type AuctionServer = Server<ClientToServerEvents, ServerToClientEvents>;

let io: AuctionServer | undefined;

export function initSocket(httpServer: HttpServer, corsOrigin: string): AuctionServer {
  io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
    cors: { origin: corsOrigin, credentials: true },
  });

  io.on('connection', (socket) => {
    logger.debug({ socketId: socket.id }, 'socket connected');

    socket.on('auction:watch', ({ loteId }) => {
      if (loteId) socket.join(auctionRoom(loteId));
    });

    socket.on('auction:unwatch', ({ loteId }) => {
      if (loteId) socket.leave(auctionRoom(loteId));
    });
  });

  return io;
}

function getIO(): AuctionServer {
  if (!io) {
    throw new Error('Socket.IO has not been initialized');
  }
  return io;
}

export function emitBidNew(payload: BidNewPayload): void {
  getIO().to(auctionRoom(payload.loteId)).emit('bid:new', payload);
}

export function emitAuctionExtended(payload: AuctionExtendedPayload): void {
  getIO().to(auctionRoom(payload.loteId)).emit('auction:extended', payload);
}

export function emitAuctionClosed(payload: AuctionClosedPayload): void {
  getIO().to(auctionRoom(payload.loteId)).emit('auction:closed', payload);
}
