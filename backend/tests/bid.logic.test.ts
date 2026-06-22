import { minimumNextBid } from '../src/services/bid.service.js';
import { computeStatus } from '../src/services/auction.service.js';

describe('minimumNextBid', () => {
  it('requires a 1% increase, rounded up to cents', () => {
    expect(minimumNextBid(100)).toBe(101);
    expect(minimumNextBid(412000)).toBe(416120);
  });

  it('rounds fractional cents upward', () => {
    expect(minimumNextBid(99.99)).toBe(100.99);
  });
});

describe('computeStatus', () => {
  const now = new Date('2026-06-22T12:00:00Z');

  it('is UPCOMING before the start', () => {
    expect(computeStatus(new Date('2026-06-23'), new Date('2026-06-24'), now)).toBe('UPCOMING');
  });

  it('is LIVE within the window', () => {
    expect(computeStatus(new Date('2026-06-21'), new Date('2026-06-23'), now)).toBe('LIVE');
  });

  it('is CLOSED after the end', () => {
    expect(computeStatus(new Date('2026-06-20'), new Date('2026-06-21'), now)).toBe('CLOSED');
  });
});
