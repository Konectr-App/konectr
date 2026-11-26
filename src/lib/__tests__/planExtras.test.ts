// © Konectr 2026. All rights reserved.
// Tests for a plan's links and Paid tag on /a/[code] (konectr-mvp#812).

import { describe, it, expect } from 'vitest';
import { planLinks, paidTag } from '../planExtras';

describe('planLinks', () => {
  it('reads the rows set_plan_extras writes', () => {
    expect(planLinks([{ label: 'Book a court', url: 'https://bftbangsar.com/hyrox/' }])).toEqual([
      { label: 'Book a court', url: 'https://bftbangsar.com/hyrox/', shortUrl: 'bftbangsar.com/hyrox' },
    ]);
  });

  it('is empty for null, a non-array, and an empty list', () => {
    expect(planLinks(null)).toEqual([]);
    expect(planLinks(undefined)).toEqual([]);
    expect(planLinks('https://a.com')).toEqual([]);
    expect(planLinks({ label: 'x', url: 'https://a.com' })).toEqual([]);
    expect(planLinks([])).toEqual([]);
  });

  it('drops anything that is not a clean https link', () => {
    const bad = [
      { label: 'http', url: 'http://a.com' },
      { label: 'script', url: 'javascript:alert(1)' },
      { label: 'data', url: 'data:text/html,<b>x</b>' },
      { label: 'no dot', url: 'https://localhost' },
      { label: 'space', url: 'https://a.com/x y' },
      { label: 'creds', url: 'https://bank.com@evil.io' },
      { label: '', url: 'https://a.com' },
      { label: 'x'.repeat(41), url: 'https://a.com' },
      { label: 'long', url: `https://a.com/${'x'.repeat(300)}` },
      { label: 'not a url', url: 'bftbangsar.com' },
      { label: 7, url: 'https://a.com' },
      { url: 'https://a.com' },
      null,
      'https://a.com',
    ];
    expect(planLinks(bad)).toEqual([]);
  });

  it('keeps the good links around a bad one, and at most three', () => {
    const rows = [
      { label: 'One', url: 'https://one.com' },
      { label: 'Bad', url: 'http://bad.com' },
      { label: 'Two', url: 'https://two.com' },
      { label: 'Three', url: 'https://three.com' },
      { label: 'Four', url: 'https://four.com' },
    ];
    expect(planLinks(rows).map((l) => l.label)).toEqual(['One', 'Two', 'Three']);
  });

  it('trims the label', () => {
    expect(planLinks([{ label: '  Menu  ', url: 'https://a.com' }])[0].label).toBe('Menu');
  });
});

describe('paidTag', () => {
  it('is null on a free plan, whatever the note says', () => {
    expect(paidTag(false, 'RM 25')).toBeNull();
    expect(paidTag(null, 'RM 25')).toBeNull();
    expect(paidTag(undefined, null)).toBeNull();
    expect(paidTag('true', 'RM 25')).toBeNull();
  });

  it('reads "Paid" with no note and "Paid · note" with one', () => {
    expect(paidTag(true, null)).toBe('Paid');
    expect(paidTag(true, '   ')).toBe('Paid');
    expect(paidTag(true, ' RM 25 at the gym ')).toBe('Paid · RM 25 at the gym');
  });

  it('caps an over-long note at 40 characters', () => {
    expect(paidTag(true, 'x'.repeat(60))).toBe(`Paid · ${'x'.repeat(40)}`);
  });
});
