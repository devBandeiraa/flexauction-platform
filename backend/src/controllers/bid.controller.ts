import type { Request, Response } from 'express';
import * as bidService from '../services/bid.service.js';
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
  const bid = await bidService.placeBid(req.params.id!, user.id, req.body.value);
  res.status(201).json(bid);
}
