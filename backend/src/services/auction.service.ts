import type { AuctionStatus, Category, Prisma } from '@prisma/client';
import * as auctionRepository from '../repositories/auction.repository.js';
import { AppError } from '../utils/AppError.js';
import {
  buildPaginatedResult,
  paginationOffset,
  type PaginationParams,
} from '../utils/pagination.js';

export interface AuctionFilters extends PaginationParams {
  category?: Category;
  state?: string;
  city?: string;
  status?: AuctionStatus;
  minPrice?: number;
  maxPrice?: number;
  q?: string;
}

export interface AuctionInput {
  title: string;
  description: string;
  category: Category;
  city: string;
  state: string;
  startPrice: number;
  appraisal?: number;
  startsAt: Date;
  endsAt: Date;
  images?: string[];
}

/** Derives the lifecycle status from the auction's time window. */
export function computeStatus(startsAt: Date, endsAt: Date, now = new Date()): AuctionStatus {
  if (now < startsAt) return 'UPCOMING';
  if (now >= endsAt) return 'CLOSED';
  return 'LIVE';
}

function buildWhere(filters: AuctionFilters): Prisma.AuctionWhereInput {
  const where: Prisma.AuctionWhereInput = {};

  if (filters.category) where.category = filters.category;
  if (filters.status) where.status = filters.status;
  if (filters.state) where.state = filters.state;
  if (filters.city) where.city = { contains: filters.city, mode: 'insensitive' };

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.currentBid = {};
    if (filters.minPrice !== undefined) where.currentBid.gte = filters.minPrice;
    if (filters.maxPrice !== undefined) where.currentBid.lte = filters.maxPrice;
  }

  if (filters.q) {
    where.OR = [
      { title: { contains: filters.q, mode: 'insensitive' } },
      { description: { contains: filters.q, mode: 'insensitive' } },
    ];
  }

  return where;
}

export async function listAuctions(filters: AuctionFilters) {
  const where = buildWhere(filters);
  const { skip, take } = paginationOffset(filters);

  const [items, total] = await Promise.all([
    auctionRepository.findManyAuctions({ where, skip, take }),
    auctionRepository.countAuctions(where),
  ]);

  return buildPaginatedResult(items, total, filters);
}

export async function getAuctionById(id: string) {
  const auction = await auctionRepository.findAuctionById(id);
  if (!auction) {
    throw new AppError(404, 'Auction not found');
  }
  return auction;
}

function assertValidWindow(startsAt: Date, endsAt: Date) {
  if (endsAt <= startsAt) {
    throw new AppError(400, 'endsAt must be after startsAt');
  }
}

export async function createAuction(auctioneerId: string, input: AuctionInput) {
  assertValidWindow(input.startsAt, input.endsAt);

  return auctionRepository.createAuction({
    title: input.title,
    description: input.description,
    category: input.category,
    city: input.city,
    state: input.state,
    startPrice: input.startPrice,
    currentBid: input.startPrice,
    appraisal: input.appraisal ?? null,
    startsAt: input.startsAt,
    endsAt: input.endsAt,
    status: computeStatus(input.startsAt, input.endsAt),
    images: input.images ?? [],
    auctioneerId,
  });
}

async function loadOwnedAuction(id: string, auctioneerId: string) {
  const auction = await auctionRepository.findAuctionById(id);
  if (!auction) {
    throw new AppError(404, 'Auction not found');
  }
  if (auction.auctioneerId !== auctioneerId) {
    throw new AppError(403, 'You can only manage auctions you created');
  }
  return auction;
}

export async function updateAuction(
  id: string,
  auctioneerId: string,
  input: Partial<AuctionInput>,
) {
  const existing = await loadOwnedAuction(id, auctioneerId);

  const startsAt = input.startsAt ?? existing.startsAt;
  const endsAt = input.endsAt ?? existing.endsAt;
  assertValidWindow(startsAt, endsAt);

  const data: Prisma.AuctionUpdateInput = {
    ...(input.title !== undefined && { title: input.title }),
    ...(input.description !== undefined && { description: input.description }),
    ...(input.category !== undefined && { category: input.category }),
    ...(input.city !== undefined && { city: input.city }),
    ...(input.state !== undefined && { state: input.state }),
    ...(input.appraisal !== undefined && { appraisal: input.appraisal }),
    ...(input.images !== undefined && { images: input.images }),
    ...(input.startsAt !== undefined && { startsAt: input.startsAt }),
    ...(input.endsAt !== undefined && { endsAt: input.endsAt }),
    status: computeStatus(startsAt, endsAt),
  };

  return auctionRepository.updateAuction(id, data);
}

export async function deleteAuction(id: string, auctioneerId: string) {
  await loadOwnedAuction(id, auctioneerId);
  await auctionRepository.deleteAuction(id);
}
