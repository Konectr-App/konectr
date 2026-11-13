// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import { afterEach, describe, expect, it, vi } from 'vitest';
import { parseCity, withCampaign } from './landingCity';

const PLAY = 'https://play.google.com/store/apps/details?id=com.konectr.konectrMobile';
const APPLE = 'https://apps.apple.com/my/app/konectr/id6758149668';

describe('parseCity', () => {
  it('reads a known city, ignoring case and spaces', () => {
    expect(parseCity('?c=bkk')).toBe('bkk');
    expect(parseCity('?utm_source=threads&c=%20KL')).toBe('kl');
  });

  it('returns null for a missing or unknown city', () => {
    expect(parseCity('')).toBeNull();
    expect(parseCity('?c=paris')).toBeNull();
    expect(parseCity('?c=toString')).toBeNull();
  });
});

describe('withCampaign', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('adds a Play referrer carrying source, city and first-touch utm_source', () => {
    const url = new URL(withCampaign(PLAY, 'android', { source: 'home_hero', city: 'bkk', utmSource: 'threads' }));
    expect(url.searchParams.get('id')).toBe('com.konectr.konectrMobile');
    const referrer = new URLSearchParams(url.searchParams.get('referrer') ?? '');
    expect(referrer.get('utm_source')).toBe('threads');
    expect(referrer.get('utm_campaign')).toBe('bkk');
    expect(referrer.get('utm_content')).toBe('home_hero');
  });

  it('falls back to neutral values and strips unsafe characters', () => {
    const url = new URL(withCampaign(PLAY, 'android', { source: 'qr<script>' }));
    const referrer = new URLSearchParams(url.searchParams.get('referrer') ?? '');
    expect(referrer.get('utm_source')).toBe('konectr.app');
    expect(referrer.get('utm_campaign')).toBe('all');
    expect(referrer.get('utm_content')).toBe('qrscript');
  });

  it('leaves the App Store link alone without a provider token', () => {
    vi.stubEnv('NEXT_PUBLIC_APPLE_PROVIDER_TOKEN', '');
    expect(withCampaign(APPLE, 'ios', { source: 'home_hero', city: 'kl' })).toBe(APPLE);
  });

  it('adds App Store campaign params when a provider token is set', () => {
    vi.stubEnv('NEXT_PUBLIC_APPLE_PROVIDER_TOKEN', '123456');
    const url = new URL(withCampaign(APPLE, 'ios', { source: 'home_hero', city: 'kl' }));
    expect(url.searchParams.get('pt')).toBe('123456');
    expect(url.searchParams.get('ct')).toBe('home_hero-kl');
  });
});
