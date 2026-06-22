import { describe, expect, it } from 'vitest';
import { formatCountdown, formatCurrency, minimumNextBid } from './format';

describe('formatCurrency', () => {
  it('formats numbers as BRL', () => {
    expect(formatCurrency(250000)).toBe('R$ 250.000,00');
  });

  it('accepts numeric strings', () => {
    expect(formatCurrency('1500.5')).toBe('R$ 1.500,50');
  });

  it('falls back to zero for invalid input', () => {
    expect(formatCurrency('abc')).toBe('R$ 0,00');
  });
});

describe('formatCountdown', () => {
  it('zero-pads hours, minutes and seconds', () => {
    expect(formatCountdown(3661 * 1000)).toBe('01:01:01');
  });

  it('clamps negatives to zero', () => {
    expect(formatCountdown(-5000)).toBe('00:00:00');
  });
});

describe('minimumNextBid', () => {
  it('mirrors the backend 1% rule, rounded up to cents', () => {
    expect(minimumNextBid(1000)).toBe(1010);
    expect(minimumNextBid('100')).toBe(101);
  });
});
