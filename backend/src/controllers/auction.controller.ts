import type { Request, Response } from 'express';
import * as auctionService from '../services/auction.service.js';
import { AppError } from '../utils/AppError.js';
import { listAuctionsQuerySchema } from '../routes/auction.validators.js';

function requireUser(req: Request) {
  if (!req.user) {
    throw new AppError(401, 'Authentication required');
  }
  return req.user;
}

function imagePaths(req: Request): string[] | undefined {
  const files = req.files as Express.Multer.File[] | undefined;
  if (!files || files.length === 0) return undefined;
  return files.map((file) => `/uploads/${file.filename}`);
}

export async function listAuctionsHandler(req: Request, res: Response): Promise<void> {
  const filters = listAuctionsQuerySchema.parse(req.query);
  const result = await auctionService.listAuctions(filters);
  res.json(result);
}

export async function getAuctionHandler(req: Request, res: Response): Promise<void> {
  const auction = await auctionService.getAuctionById(req.params.id!);
  res.json(auction);
}

export async function createAuctionHandler(req: Request, res: Response): Promise<void> {
  const user = requireUser(req);
  const auction = await auctionService.createAuction(user.id, {
    ...req.body,
    images: imagePaths(req),
  });
  res.status(201).json(auction);
}

export async function updateAuctionHandler(req: Request, res: Response): Promise<void> {
  const user = requireUser(req);
  const images = imagePaths(req);
  const auction = await auctionService.updateAuction(req.params.id!, user.id, {
    ...req.body,
    ...(images && { images }),
  });
  res.json(auction);
}

export async function deleteAuctionHandler(req: Request, res: Response): Promise<void> {
  const user = requireUser(req);
  await auctionService.deleteAuction(req.params.id!, user.id);
  res.status(204).send();
}
