import { jest } from '@jest/globals';
import { AppError } from '../src/utils/AppError.js';

interface TxMock {
  auction: { findUnique: jest.Mock; update: jest.Mock };
  bid: { create: jest.Mock; count: jest.Mock };
}

const tx: TxMock = {
  auction: { findUnique: jest.fn(), update: jest.fn() },
  bid: { create: jest.fn(), count: jest.fn() },
};

const prismaMock = {
  $transaction: jest.fn((cb: (t: TxMock) => unknown) => cb(tx)),
};

jest.unstable_mockModule('../src/config/prisma.js', () => ({ prisma: prismaMock }));

const { placeBid } = await import('../src/services/bid.service.js');

const HOUR = 60 * 60 * 1000;

function liveAuction(overrides: Record<string, unknown> = {}) {
  return {
    id: 'auction-1',
    auctioneerId: 'auctioneer-1',
    status: 'LIVE',
    startsAt: new Date(Date.now() - HOUR),
    endsAt: new Date(Date.now() + HOUR),
    currentBid: 1000,
    bids: [] as Array<{ userId: string; value: number }>,
    ...overrides,
  };
}

async function expectStatus(promise: Promise<unknown>, status: number) {
  await expect(promise).rejects.toMatchObject({ statusCode: status });
  await expect(promise).rejects.toBeInstanceOf(AppError);
}

beforeEach(() => {
  jest.clearAllMocks();
  tx.bid.create.mockResolvedValue({ id: 'bid-1', value: 1010, userId: 'bidder-1' });
  tx.bid.count.mockResolvedValue(1);
  tx.auction.update.mockResolvedValue({});
});

describe('placeBid', () => {
  it('accepts a valid bid and updates the current bid', async () => {
    tx.auction.findUnique.mockResolvedValue(liveAuction());
    const result = await placeBid('auction-1', 'bidder-1', 1010);
    expect(result.totalBids).toBe(1);
    expect(result.extended).toBe(false);
    expect(tx.auction.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ currentBid: 1010 }) }),
    );
  });

  it('rejects a bid on a missing auction', async () => {
    tx.auction.findUnique.mockResolvedValue(null);
    await expectStatus(placeBid('auction-x', 'bidder-1', 1010), 404);
  });

  it('rejects the auctioneer bidding on their own auction', async () => {
    tx.auction.findUnique.mockResolvedValue(liveAuction());
    await expectStatus(placeBid('auction-1', 'auctioneer-1', 1010), 403);
  });

  it('rejects a bid when the auction is not live', async () => {
    tx.auction.findUnique.mockResolvedValue(liveAuction({ status: 'CLOSED' }));
    await expectStatus(placeBid('auction-1', 'bidder-1', 1010), 409);
  });

  it('rejects the current top bidder bidding again', async () => {
    tx.auction.findUnique.mockResolvedValue(
      liveAuction({ bids: [{ userId: 'bidder-1', value: 1000 }] }),
    );
    await expectStatus(placeBid('auction-1', 'bidder-1', 1010), 409);
  });

  it('rejects a bid below the 1% minimum', async () => {
    tx.auction.findUnique.mockResolvedValue(liveAuction({ currentBid: 1000 }));
    await expectStatus(placeBid('auction-1', 'bidder-1', 1005), 422);
  });

  it('extends the end time when a bid lands in the final minutes', async () => {
    tx.auction.findUnique.mockResolvedValue(
      liveAuction({ endsAt: new Date(Date.now() + 2 * 60 * 1000) }),
    );
    const result = await placeBid('auction-1', 'bidder-1', 1010);
    expect(result.extended).toBe(true);
    expect(result.endsAt.getTime()).toBeGreaterThan(Date.now() + 4 * 60 * 1000);
  });
});
