import type { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';

const auctioneerSelect = {
  select: { id: true, name: true },
} satisfies Prisma.UserDefaultArgs;

const listInclude = {
  auctioneer: auctioneerSelect,
  _count: { select: { bids: true } },
} satisfies Prisma.AuctionInclude;

const detailInclude = {
  auctioneer: auctioneerSelect,
  _count: { select: { bids: true } },
} satisfies Prisma.AuctionInclude;

export function findManyAuctions(args: {
  where: Prisma.AuctionWhereInput;
  skip: number;
  take: number;
}) {
  return prisma.auction.findMany({
    where: args.where,
    include: listInclude,
    orderBy: { endsAt: 'asc' },
    skip: args.skip,
    take: args.take,
  });
}

export function countAuctions(where: Prisma.AuctionWhereInput) {
  return prisma.auction.count({ where });
}

export function findAuctionById(id: string) {
  return prisma.auction.findUnique({ where: { id }, include: detailInclude });
}

export function createAuction(data: Prisma.AuctionUncheckedCreateInput) {
  return prisma.auction.create({ data, include: detailInclude });
}

export function updateAuction(id: string, data: Prisma.AuctionUpdateInput) {
  return prisma.auction.update({ where: { id }, data, include: detailInclude });
}

export function deleteAuction(id: string) {
  return prisma.auction.delete({ where: { id } });
}
