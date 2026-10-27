import { describe, expect, it } from 'vitest';
import { createRateLimiter } from '../rateLimit';

describe('createRateLimiter', () => {
  it('allows up to the limit, then refuses within the window', () => {
    const allow = createRateLimiter(3, 1000, () => 0);
    expect([allow('a'), allow('a'), allow('a'), allow('a')]).toEqual([true, true, true, false]);
  });

  it('opens again once the window has passed', () => {
    let t = 0;
    const allow = createRateLimiter(1, 1000, () => t);
    expect(allow('a')).toBe(true);
    expect(allow('a')).toBe(false);
    t = 1000;
    expect(allow('a')).toBe(true);
  });

  it('counts each key separately', () => {
    const allow = createRateLimiter(1, 1000, () => 0);
    expect(allow('a')).toBe(true);
    expect(allow('b')).toBe(true);
    expect(allow('a')).toBe(false);
  });
});
