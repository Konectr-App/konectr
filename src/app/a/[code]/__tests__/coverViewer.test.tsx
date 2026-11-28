// © Konectr 2026. All rights reserved.
// Tests for the plan-cover viewer on /a/[code] (Konectr-App/konectr-mvp#825):
// the focal-point crop, the expand hint, the hero trigger and the lightbox.
// The suite runs in node (no DOM), so these render to static markup; opening
// and closing are checked in a browser.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

// The page imports the Supabase client; no network in tests.
vi.mock('@supabase/supabase-js', () => ({ createClient: () => ({ rpc: vi.fn() }) }));

import { coverObjectPosition } from '@/lib/planCover';
import type { SharedActivity } from '@/lib/supabase';
import { MIXED_SHARE_ROW, REDACTED_SHARE_ROW } from '@/lib/__tests__/fixtures/women-only';
import RsvpLayout, { type PosterViewer } from '../redesign/RsvpLayout';
import CoverLightbox from '../redesign/CoverLightbox';
import ActivityRsvpPage from '../ActivityRsvpPage';
import { resolveVibe } from '../redesign/vibes';

const COVER = 'https://example.supabase.co/storage/v1/object/public/activity-covers/'
  + '00000000-0000-0000-0000-000000000000/0123456789abcdef0123456789abcdef.jpg';
const noop = () => {};

function hero(viewer?: PosterViewer, photo = COVER) {
  return renderToStaticMarkup(
    <RsvpLayout vibe={resolveVibe('cafe')} photo={photo} venueName="Poster night" viewer={viewer}>
      <p>body</p>
    </RsvpLayout>,
  );
}

describe('coverObjectPosition', () => {
  it('maps 0..1 to percentages', () => {
    expect(coverObjectPosition(0, 1)).toBe('0% 100%');
    expect(coverObjectPosition(0.25, 0.8)).toBe('25% 80%');
    expect(coverObjectPosition(0.07, 0.333333)).toBe('7% 33.33%');
  });

  it('is the centre when the fields are null or missing', () => {
    expect(coverObjectPosition(null, null)).toBe('50% 50%');
    expect(coverObjectPosition(undefined, undefined)).toBe('50% 50%');
  });

  it('is the centre when a value is out of range or not a number', () => {
    expect(coverObjectPosition(-0.1, 1.1)).toBe('50% 50%');
    expect(coverObjectPosition(NaN, Infinity)).toBe('50% 50%');
    expect(coverObjectPosition('0.2' as unknown as number, {} as unknown as number)).toBe('50% 50%');
  });

  it('falls back per axis', () => {
    expect(coverObjectPosition(0.2, null)).toBe('20% 50%');
    expect(coverObjectPosition(2, 0.9)).toBe('50% 90%');
  });
});

describe('RsvpLayout poster viewer', () => {
  it('makes the hero a labelled button and shows the hint on a custom cover', () => {
    const html = hero({ customCover: true, objectPosition: '20% 80%', onShare: noop });
    expect(html).toContain('<button type="button" aria-label="Plan cover, opens full screen"');
    expect(html).toContain('data-cover-hint');
    expect(html).toMatch(/object-position:\s*20% 80%/);
  });

  it('has no hint and no focal point on a default photo, but still opens', () => {
    const html = hero({ customCover: false, onShare: noop }, '/images/activities/cafe.jpg');
    expect(html).toContain('aria-label="Plan cover, opens full screen"');
    expect(html).not.toContain('data-cover-hint');
    expect(html).not.toContain('object-position');
  });

  it('starts closed', () => {
    expect(hero({ customCover: true, onShare: noop })).not.toContain('role="dialog"');
  });

  it('renders no trigger without a viewer', () => {
    const html = hero(undefined);
    expect(html).not.toContain('Plan cover, opens full screen');
    expect(html).not.toContain('data-cover-hint');
  });
});

describe('CoverLightbox', () => {
  const html = renderToStaticMarkup(<CoverLightbox src={COVER} onShare={noop} onClose={noop} />);

  it('is a modal dialog', () => {
    expect(html).toContain('role="dialog"');
    expect(html).toContain('aria-modal="true"');
  });

  it('shows the original URL in a plain img, uncropped', () => {
    const imgs = html.match(/<img [^>]*>/g) ?? [];
    expect(imgs).toHaveLength(1);
    expect(imgs[0]).toContain(`src="${COVER}"`);
    expect(imgs[0]).toContain('object-contain');
    expect(html).not.toContain('/_next/image');
  });

  it('has Share and Close only, and nothing to download', () => {
    const buttons = html.match(/<button[\s\S]*?<\/button>/g) ?? [];
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toContain('aria-label="Close"');
    expect(buttons[1]).toContain('Share');
    expect(html).not.toMatch(/\bdownload\b/i);
    expect(html).not.toContain('<a ');
  });
});

// The page's first paint (the loading shell) carries the same poster as every
// later state, so it shows whether the page wires the cover through.
describe('ActivityRsvpPage poster', () => {
  const COVER_PATH = '7a1c2e3f-4b5d-4c6e-8f70-81a2b3c4d5e6/0123456789abcdef0123456789abcdef.jpg';
  const FUTURE = { start_time: '2099-01-01T02:00:00+00:00', end_time: '2099-01-01T04:00:00+00:00' };
  const page = (activity: SharedActivity) =>
    renderToStaticMarkup(<ActivityRsvpPage activity={activity} shareCode={activity.share_code} />);

  beforeEach(() => vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co'));
  afterEach(() => vi.unstubAllEnvs());

  it('shows the hint and the focal point with a custom cover', () => {
    const html = page({ ...MIXED_SHARE_ROW, ...FUTURE, cover_path: COVER_PATH, cover_focal_x: 0.3, cover_focal_y: 0.1 });
    expect(html).toContain('activity-covers');
    expect(html).toContain('Plan cover, opens full screen');
    expect(html).toContain('data-cover-hint');
    expect(html).toMatch(/object-position:\s*30% 10%/);
  });

  it('centres a custom cover when the RPC has no focal fields yet', () => {
    const html = page({ ...MIXED_SHARE_ROW, ...FUTURE, cover_path: COVER_PATH });
    expect(html).toContain('data-cover-hint');
    expect(html).toMatch(/object-position:\s*50% 50%/);
  });

  it('has no hint without a custom cover', () => {
    const html = page({ ...MIXED_SHARE_ROW, ...FUTURE, cover_path: null });
    expect(html).toContain('Plan cover, opens full screen');
    expect(html).not.toContain('data-cover-hint');
    expect(html).not.toContain('object-position');
  });

  it('never shows a cover on a redacted women-only plan', () => {
    const html = page({ ...REDACTED_SHARE_ROW, cover_path: COVER_PATH, cover_focal_x: 0.3, cover_focal_y: 0.1 });
    expect(html).not.toContain('activity-covers');
    expect(html).not.toContain('data-cover-hint');
    expect(html).not.toContain('object-position');
  });
});
