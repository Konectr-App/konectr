// © Konectr 2026. All rights reserved.
// Tests for /a/[code] metadata (PF-46: women-only plans get a generic preview).

import { describe, it, expect, vi, beforeEach } from 'vitest';

const { formatWeekdayDateSpy } = vi.hoisted(() => ({ formatWeekdayDateSpy: vi.fn() }));

vi.mock('@/lib/datetime', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/datetime')>();
  return {
    ...actual,
    formatWeekdayDate: (s: string) => {
      formatWeekdayDateSpy(s);
      return actual.formatWeekdayDate(s);
    },
  };
});

import type { Metadata } from 'next';
import type { SharedActivity } from '@/lib/supabase';
import { SHARE_OG_IMAGE } from '@/lib/metadata';
import { formatWeekdayDate, formatTime } from '@/lib/datetime';
import { buildShareMetadata, WOMEN_ONLY_SHARE_TITLE } from '../shareMetadata';
import { REDACTED_SHARE_ROW, MIXED_SHARE_ROW } from '@/lib/__tests__/fixtures/women-only';

// generateMetadata's activity branch as it stood on origin/main before PF-46
// (src/app/a/[code]/page.tsx @ 9326f6b), copied verbatim. The mixed-plan
// output must not move by a byte.
function legacyMetadata(activity: SharedActivity, code: string): Metadata {
  const venueName = activity.venue_name || 'TBD';
  const spotsLeft = Math.max(0, activity.max_participants - Number(activity.current_participants));
  const spotsText = activity.max_participants > 0
    ? (spotsLeft === 0 ? 'Full' : `${spotsLeft} ${spotsLeft === 1 ? 'spot' : 'spots'} left`)
    : `${activity.current_participants} joined`;
  const richDescription = `${formatWeekdayDate(activity.start_time!)}, ${formatTime(activity.start_time!)} at ${venueName} · ${spotsText} · Join ${activity.creator_name} on Konectr`;

  return {
    title: `${activity.title} - Join on Konectr`,
    description: richDescription,
    alternates: {
      canonical: `https://konectr.app/a/${code}`,
    },
    openGraph: {
      title: `${activity.title} - Konectr`,
      description: richDescription,
      url: `https://konectr.app/a/${code}`,
      type: 'website',
      images: [SHARE_OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${activity.title} - Konectr`,
      description: richDescription,
      images: [SHARE_OG_IMAGE.url],
    },
  };
}

describe('buildShareMetadata — mixed plans unchanged', () => {
  const variants: [string, SharedActivity][] = [
    ['open spots', MIXED_SHARE_ROW],
    ['one spot', { ...MIXED_SHARE_ROW, current_participants: 4 }],
    ['full', { ...MIXED_SHARE_ROW, current_participants: 5 }],
    ['no cap', { ...MIXED_SHARE_ROW, max_participants: 0 }],
    ['no venue', { ...MIXED_SHARE_ROW, venue_name: null }],
  ];

  it.each(variants)('%s', (_label, activity) => {
    expect(buildShareMetadata(activity, 'ABC123')).toEqual(legacyMetadata(activity, 'ABC123'));
  });
});

describe('buildShareMetadata — women-only (PF-46)', () => {
  beforeEach(() => {
    formatWeekdayDateSpy.mockClear();
  });

  it('emits the generic preview for a redacted plan without touching its null time', () => {
    const meta = buildShareMetadata(REDACTED_SHARE_ROW, 'K7Q2WXYZ');

    expect(meta.title).toBe(WOMEN_ONLY_SHARE_TITLE);
    expect(meta.openGraph?.title).toBe('A women-only activity on Konectr');
    expect(meta.twitter?.title).toBe('A women-only activity on Konectr');
    expect(meta.robots).toEqual({ index: false, follow: false });
    expect(formatWeekdayDateSpy).not.toHaveBeenCalled();
    expect(JSON.stringify(meta)).not.toMatch(/Invalid Date|NaN|1970|Thu, Jan 1/);
  });

  it('keeps an unredacted women-only payload out of the preview too', () => {
    const unredacted: SharedActivity = { ...MIXED_SHARE_ROW, women_only: true };
    const text = JSON.stringify(buildShareMetadata(unredacted, 'ABC123'));

    for (const leak of ['Coffee Chat', 'Kenny Hills Bakers', 'Alex', 'Sat']) {
      expect(text).not.toContain(leak);
    }
  });

  it('still points the card at the absolute share image', () => {
    const meta = buildShareMetadata(REDACTED_SHARE_ROW, 'K7Q2WXYZ');
    expect(meta.openGraph?.images).toEqual([SHARE_OG_IMAGE]);
    expect(meta.openGraph?.url).toBe('https://konectr.app/a/K7Q2WXYZ');
  });
});

describe('buildShareMetadata — not found', () => {
  it('keeps the dead-link preview card', () => {
    const meta = buildShareMetadata(null, 'NOPE1234');
    expect(meta.title).toBe('Activity Not Found - Konectr');
    expect(meta.openGraph?.images).toEqual([SHARE_OG_IMAGE]);
  });
});
