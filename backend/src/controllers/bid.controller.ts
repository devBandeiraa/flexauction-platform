import type { Request, Response } from 'express';
import * as bidService from '../services/bid.service.js';
import { emitAuctionExtended, emitBidNew } from '../sockets/index.js';
import { AppError } from '../utils/AppError.js';

function requireUser(req: Request) {
  if (!req.user) {
    throw new AppError(401, 'Authentication required');
  }
  return req.user;
}

export async function listBidsHandler(req: Request, res: Response): Promise<void> {
  const bids = await bidService.getAuctionBids(req.params.id!);
  res.json(bids);
}

export async function placeBidHandler(req: Request, res: Response): Promise<void> {
  const user = requireUser(req);
  const auctionId = req.params.id!;
  const result = await bidService.placeBid(auctionId, user.id, req.body.value);

  emitBidNew({
    loteId: auctionId,
    valor: Number(result.bid.value),
    totalLances: result.totalBids,
    encerraEm: result.endsAt.toISOString(),
  });

  if (result.extended) {
    emitAuctionExtended({ loteId: auctionId, novoEncerramento: result.endsAt.toISOString() });
  }

  res.status(201).json(result.bid);
}
