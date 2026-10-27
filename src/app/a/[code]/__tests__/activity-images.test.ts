// © Konectr 2026. All rights reserved.
// Tests for the /a/[code] hero image resolver (PF-46: no men on a women-only hero).

import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { activityImage, HASHTAG_IMAGE, WOMEN_ONLY_PATTERN } from '../redesign/activity-images';
import type { VibeKey } from '../redesign/vibes';

const VIBES: VibeKey[] = ['chill', 'active', 'focus', 'creative', 'adventure', 'social'];
// One title per keyword rule, plus nothing-matches.
const TITLES = [
  'Padel night', 'Pickle ball', 'Batting cage', 'Bowling night', 'Ping pong', 'Badminton doubles', 'Tennis rally',
  'Driving range', 'Go-kart', 'Dragon boat', 'Kayak trip', 'Photo walk', 'Movie night', 'Mamak supper', 'Brunch',
  'Coffee',
  'Gym session', 'Bukit Kiara hike', 'Rooftop sunset', 'Cocktail bar', 'Lunch at TRX',
  'Makan dinner', 'Morning run', 'Yoga flow', 'Hoops', 'Futsal', 'Bouldering',
  'Pottery wheel throw', 'Board games', 'Paint and sip', 'Cowork Friday', 'Nights of Fright', 'Safehouse Sky Society', 'Hang out',
];
const SAFE = ['art', 'basketball', 'cowork', 'golf', 'padel', 'pottery', 'trx', 'yoga'].map((k) => `/images/activities/${k}.jpg`);

describe('activityImage — women-only (PF-46)', () => {
  it('only ever returns a vetted photo or the pattern', () => {
    for (const vibe of VIBES) {
      for (const title of TITLES) {
        const img = activityImage({ vibe, title, womenOnly: true });
        expect([...SAFE, WOMEN_ONLY_PATTERN]).toContain(img);
      }
    }
  });

  it('swaps a matched photo that shows men for the pattern', () => {
    expect(activityImage({ vibe: 'active', title: 'Morning run', womenOnly: true })).toBe(WOMEN_ONLY_PATTERN);
    expect(activityImage({ vibe: 'adventure', title: 'Bukit Kiara hike', womenOnly: true })).toBe(WOMEN_ONLY_PATTERN);
  });

  it('keeps a matched photo that is safe', () => {
    expect(activityImage({ vibe: 'active', title: 'Yoga flow', womenOnly: true })).toBe('/images/activities/yoga.jpg');
    expect(activityImage({ vibe: 'creative', title: 'Pottery wheel throw', womenOnly: true })).toBe('/images/activities/pottery.jpg');
  });

  it('falls back by vibe to a safe photo, or the pattern', () => {
    expect(activityImage({ vibe: 'focus', womenOnly: true })).toBe('/images/activities/cowork.jpg');
    expect(activityImage({ vibe: 'active', womenOnly: true })).toBe('/images/activities/yoga.jpg');
    expect(activityImage({ vibe: 'social', womenOnly: true })).toBe(WOMEN_ONLY_PATTERN);
    expect(activityImage({ vibe: 'chill', womenOnly: true })).toBe(WOMEN_ONLY_PATTERN);
  });
});

describe('activityImage — mixed plans unchanged', () => {
  it.each([
    [{ vibe: 'active' as VibeKey, title: 'Morning run' }, '/images/activities/run.jpg'],
    [{ vibe: 'active' as VibeKey, title: 'Padel night' }, '/images/activities/padel.jpg'],
    [{ vibe: 'social' as VibeKey, title: 'Lunch', venueName: 'The Exchange TRX' }, '/images/activities/trx.jpg'],
    [{ vibe: 'chill' as VibeKey, title: 'Hang out' }, '/images/email/cafe-friends.jpg'],
    [{ vibe: 'social' as VibeKey, title: 'Hang out', womenOnly: false }, '/images/email/friends-group.jpg'],
  ])('%o', (opts, expected) => {
    expect(activityImage(opts)).toBe(expected);
  });
});

describe('activityImage — bowling + title before purpose', () => {
  // Live plans, 2026-10-12.
  const bowlingPurpose =
    'Bowl, cheer, laugh. Gutter balls welcome. 4:00 PM – 6:00 PM (dinner after). Supreme Cosmic Bowl, Mid Valley';

  it.each([
    // 34F50405: "dinner after" in the purpose used to win the restaurant photo.
    [{ vibe: 'social' as VibeKey, title: '☕ 🎳 STRIKES, SPARES & NEW FRIENDS!', venueName: 'Supreme Bowl - Mid Valley Megamall, KL', purpose: bowlingPurpose, category: 'entertainment' }, 'bowling'],
    // 8995C545: same plan filed under the cafe category.
    [{ vibe: 'chill' as VibeKey, title: '🎳 STRIKES, SPARES & NEW FRIENDS!', venueName: 'Supreme Bowl - Mid Valley Megamall, KL', purpose: bowlingPurpose, category: 'cafe' }, 'bowling'],
    [{ vibe: 'social' as VibeKey, title: 'Let’s Go bowling! 🎳', venueName: 'Sunway Pyramid Bowling' }, 'bowling'],
    // Bowling named only in the purpose still matches when the title says nothing.
    [{ vibe: 'social' as VibeKey, title: 'Saturday plan', purpose: 'Ten-pin at Megalanes' }, 'bowling'],
    // 40DCB4C3: the title wins over a passing mention in the purpose.
    [{ vibe: 'social' as VibeKey, title: 'BAR HUNT: FAIRY EDITION!', venueName: 'The Iron Fairies', purpose: 'Skipped bowling? Join anyway' }, 'bar'],
    // A bare "bowl" is food, not bowling.
    [{ vibe: 'social' as VibeKey, title: 'Ramen slurping competition', purpose: 'Who can finish a bowl fastest?', category: 'Restaurant' }, 'restaurant'],
    [{ vibe: 'active' as VibeKey, title: 'Yoga in the Park', purpose: 'We usually grab acai bowls after!' }, 'yoga'],
  ])('%o', (opts, key) => {
    expect(activityImage(opts)).toBe(`/images/activities/${key}.jpg`);
  });

  it('keeps a women-only bowling plan on the pattern (the photo shows men)', () => {
    expect(activityImage({ vibe: 'social', title: 'Bowling night', womenOnly: true })).toBe(WOMEN_ONLY_PATTERN);
  });
});

describe('activityImage — hashtag photos', () => {
  const PUBLIC = path.resolve(__dirname, '../../../../../public/images/activities');

  it('every hashtag maps to a photo that exists', () => {
    for (const [tag, key] of Object.entries(HASHTAG_IMAGE)) {
      expect(existsSync(path.join(PUBLIC, `${key}.jpg`)), `#${tag} → ${key}.jpg`).toBe(true);
    }
  });

  it.each([
    // The hashtag wins over whatever the title says.
    [{ vibe: 'social' as VibeKey, title: 'Sunday rally', tags: ['pickleball'] }, 'pickleball'],
    // Hub keys and markers are skipped; the hashtag beside them counts.
    [{ vibe: 'chill' as VibeKey, title: 'Slow morning', tags: ['cafe-hub', 'coffee'] }, 'cafe'],
    [{ vibe: 'active' as VibeKey, title: 'Morning run', tags: ['test-seed'] }, 'run'],
    // Free-text tags can't reach Object.prototype.
    [{ vibe: 'active' as VibeKey, title: 'Morning run', tags: ['constructor', '__proto__'] }, 'run'],
    [{ vibe: 'social' as VibeKey, title: 'Saturday plan', tags: ['BOWLING'] }, 'bowling'],
  ])('%o', (opts, key) => {
    expect(activityImage(opts)).toBe(`/images/activities/${key}.jpg`);
  });

  it('a women-only plan still gets the pattern for a hashtag photo that shows men', () => {
    expect(activityImage({ vibe: 'active', tags: ['pickleball'], womenOnly: true })).toBe(WOMEN_ONLY_PATTERN);
    expect(activityImage({ vibe: 'active', tags: ['padel'], womenOnly: true })).toBe('/images/activities/padel.jpg');
  });

  // Live plans, 2026-10-12, that used to fall through to a vibe or a wrong photo.
  it.each([
    [{ vibe: 'active' as VibeKey, title: 'Pickleball', venueName: 'Yoga Movement TTDI' }, 'pickleball'],
    [{ vibe: 'active' as VibeKey, title: 'Pickle ball', venueName: 'Bistari Condominium' }, 'pickleball'],
    [{ vibe: 'active' as VibeKey, title: 'PADEL 2.0', venueName: 'ASCARO Padel and Social Club TREC' }, 'padel'],
    [{ vibe: 'social' as VibeKey, title: 'Golf - Friendly Long Drive Contest', venueName: 'DK Arena Golf Club, Subang Jaya' }, 'golf'],
    [{ vibe: 'social' as VibeKey, title: 'MOVIE UNDER THE STARS!', venueName: 'Sunsan Bake' }, 'movies'],
    [{ vibe: 'social' as VibeKey, title: 'Evening out', venueName: 'Jalan Alor Food Street' }, 'streetfood'],
    [{ vibe: 'chill' as VibeKey, title: 'Weekend brunch', venueName: 'Merchant Lane', category: 'cafe' }, 'brunch'],
    [{ vibe: 'social' as VibeKey, title: '🏎️ POWER-UP & RACE — MARIO GO-KART!', venueName: 'Go-Kart BTSKL' }, 'gokart'],
    [{ vibe: 'social' as VibeKey, title: 'Table Tennis & Chill 🏓', venueName: 'Mont’ Kiara Palma' }, 'tabletennis'],
    [{ vibe: 'adventure' as VibeKey, title: 'DRAGON BOAT Experience', venueName: 'PARC' }, 'dragonboat'],
    // Title says nothing; the purpose's rafting beats its waterfall stop.
    [{ vibe: 'adventure' as VibeKey, title: 'Kampung Ulu Slim', purpose: 'Whitewater rafting, waterfall pit stop, lunch included' }, 'kayaking'],
    [{ vibe: 'adventure' as VibeKey, title: 'Photo walk', venueName: 'Publika Shopping Gallery' }, 'photowalk'],
    [{ vibe: 'social' as VibeKey, title: 'GAMES & CHILL — BOARD GAME NIGHT!*', venueName: 'Bored. (Damansara Jaya)' }, 'games'],
    // A passing "film" in the details is not a movie night.
    [{ vibe: 'creative' as VibeKey, title: 'DDH creative circle vol. 3', venueName: 'Curiosite KL', purpose: 'Bring a sketchbook, a film camera, anything', category: 'cafe' }, 'cafe'],
  ])('%o', (opts, key) => {
    expect(activityImage(opts)).toBe(`/images/activities/${key}.jpg`);
  });
});

describe('activityImage — Nights of Fright poster', () => {
  it('shows the event poster for the live plan (share 395AAF96)', () => {
    expect(activityImage({
      vibe: 'adventure', title: 'Night of Frights! 12 @ Sunway Lagoon', venueName: 'Sunway Lagoon',
      purpose: 'Nights of Fright 12 at Sunway Lagoon. Haunted houses, scare zones.', category: 'outdoors',
    })).toBe('/images/activities/nights-of-fright.jpg');
  });

  it('keeps other Sunway Lagoon plans off the horror poster', () => {
    expect(activityImage({ vibe: 'adventure', title: 'Water park day', venueName: 'Sunway Lagoon' }))
      .not.toBe('/images/activities/nights-of-fright.jpg');
  });
});

describe('activityImage — Safehouse Sky Society venue photo', () => {
  it('shows the venue photo for the live plan (share 31125EB1)', () => {
    expect(activityImage({
      vibe: 'chill',
      title: '☕ SKY HIGH SUNDAY SOCIAL!',
      venueName: 'Safehouse Sky Society KL',
      purpose: 'Industrial rooftop cafe, city views, easy chats.',
      category: 'cafe',
    })).toBe('/images/activities/safehouse.jpg');
  });

  it('keeps other rooftop cafes on the cafe photo', () => {
    expect(activityImage({ vibe: 'chill', title: 'Sunday social', purpose: 'Industrial rooftop cafe', category: 'cafe' }))
      .toBe('/images/activities/cafe.jpg');
  });
});

describe('activityImage — event photos beat the hashtag', () => {
  // Live tags, 2026-10-27: the Safehouse plan carries #coffee, which maps to cafe.jpg.
  it.each([
    [{ vibe: 'chill' as VibeKey, title: '☕ SKY HIGH SUNDAY SOCIAL!', venueName: 'Safehouse Sky Society KL', tags: ['coffee', 'cafe-hub'] }, 'safehouse'],
    [{ vibe: 'social' as VibeKey, title: '🎭 HALLOWEEN ROOFTOP MASQUERADE', venueName: 'Upper House', tags: ['social'] }, 'halloween-masquerade'],
    [{ vibe: 'adventure' as VibeKey, title: 'Night of Frights! 12 @ Sunway Lagoon', venueName: 'Sunway Lagoon', tags: ['social'] }, 'nights-of-fright'],
  ])('%o', (opts, key) => {
    expect(activityImage(opts)).toBe(`/images/activities/${key}.jpg`);
  });
});
