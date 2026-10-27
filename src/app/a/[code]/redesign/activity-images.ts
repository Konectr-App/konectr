// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

// Activity-type image library. The vibe is locked (colour/emoji/name), but the HERO
// IMAGE keys to the *specific* activity — padel → padel, cafe → cafe, hike → trail —
// so the photo actually complements what people are matching into.
//
// Hashtags (CANONICAL §12.2): every plan carries one curated hashtag, and every
// hashtag has one standard default photo (founder, 2026-10-12). A Captain's own
// cover (PF-12) overrides it on the app's plan screen only; this page keeps the
// hashtag's photo. Plans without a hashtag (older builds) fall back to keywords,
// then to the vibe-level photo.
//
// Assets live in public/images/activities/, named by hashtag slug. To add one: drop
// <slug>.jpg there (1200 wide, 4:5 or 3:2, q82), add it to HASHTAG_IMAGE and give it
// a keyword row. Stock photos are Unsplash License (free commercial use, no credit
// required); provenance is in the konectr-web CLAUDE.md version history.

import type { VibeKey } from './vibes';

// Hashtag slug (lib/constants/activity_hashtags.dart in the app) → image key. A tag
// missing here has no photo of its own yet and falls through to keywords. squash,
// futsal, frisbee, hyrox and trailrun share the closest sport's photo, as their
// keywords already did.
export const HASHTAG_IMAGE: Readonly<Record<string, string>> = {
  coffee: 'cafe',
  pickleball: 'pickleball',
  badminton: 'badminton',
  workout: 'gym',
  hiking: 'hike',
  streetfood: 'streetfood',
  brunch: 'brunch',
  running: 'run',
  golf: 'golf',
  padel: 'padel',
  boardgames: 'games',
  movies: 'movies',
  hyrox: 'gym',
  trailrun: 'hike',
  bouldering: 'climb',
  tennis: 'tennis',
  futsal: 'football',
  football: 'football',
  basketball: 'basketball',
  tabletennis: 'tabletennis',
  squash: 'tennis',
  yoga: 'yoga',
  kayaking: 'kayaking',
  dragonboat: 'dragonboat',
  frisbee: 'football',
  photowalk: 'photowalk',
  gokart: 'gokart',
  bowling: 'bowling',
  pottery: 'pottery',
};

// Founder-supplied event posters and venue photos. Checked before the hashtag: the
// Safehouse plans carry #coffee, and the poster is why the page exists.
const EVENT_RULES: Array<[RegExp, string]> = [
  // Nights of Fright (Sunway Lagoon Halloween festival, e.g. "Night of Frights! 12 @
  // Sunway Lagoon", share 395AAF96). nights-of-fright.jpg = founder-made event poster
  // (1080×1440). Keyed to the event name, not the venue: Sunway Lagoon also hosts
  // daytime water-park plans that must not get a horror poster.
  [/nights? of frights?/, 'nights-of-fright'],
  // Safehouse Sky Society KL (Jalan Raja Chulan), e.g. "SKY HIGH SUNDAY SOCIAL!"
  // (share 31125EB1). Keyed to the venue: its plans say "rooftop cafe", which the
  // cafe rule would take. safehouse.jpg = founder-supplied venue interior (786×1048).
  [/safehouse sky society/, 'safehouse'],
  // Halloween Rooftop Masquerade @ Upper House (share E812979F, 31 Oct 2026).
  // halloween-masquerade.jpg = founder-made event poster (1080×1350), centred on a
  // black 2400×1350 canvas so object-cover never crops its title or date. Keyed to the
  // event name and above the rooftop rule, so other Upper House / rooftop plans keep
  // the normal rooftop photo.
  [/halloween (?:rooftop )?masquerade/, 'halloween-masquerade'],
];

// Keyword → image key, checked in order (most specific first). Two passes, lowercased:
// venue name + title first, then with purpose + category added. The title says what
// the plan is; the purpose often names side things ("dinner after", "skipped bowling?
// join anyway") that would otherwise steal the photo.
const KEYWORD_RULES: Array<[RegExp, string]> = [
  [/\bpadel\b/, 'padel'],
  // "Pickle ball" is how half the live pickleball plans spell it.
  [/pickle ?ball/, 'pickleball'],
  // Indoor batting cages (e.g. "SWING FOR IT — BASEBALL CAGE!" @ Swing! Batting
  // Centre, Melawati Mall). baseball.jpg = founder-supplied indoor cage photo (1200²).
  [/baseball|softball|batting/, 'baseball'],
  // Ten-pin bowling (e.g. "STRIKES, SPARES & NEW FRIENDS!" @ Supreme Bowl, Mid Valley).
  // Never bare "bowl": live plans say "a bowl of ramen" and "acai bowls".
  [/bowling|ten-?pin|🎳|mega ?lanes|\b(?:cosmic|supreme) ?bowl\b|superbowl/, 'bowling'],
  // Before tennis, which would otherwise take "table tennis".
  [/table tennis|ping ?pong/, 'tabletennis'],
  [/badminton|shuttle/, 'badminton'],
  [/tennis|squash/, 'tennis'],
  [/\bgolf|driving range/, 'golf'],
  [/go-?kart|karting/, 'gokart'],
  [/dragon ?boat/, 'dragonboat'],
  // Before hike: "whitewater rafting, waterfall pit stop" is a day on the water.
  [/kayak|paddleboard|rafting|canoe/, 'kayaking'],
  [/photo ?walk|photography/, 'photowalk'],
  // No bare "film": a creative circle whose details mention film took the movies photo.
  [/\bmovies?\b|cinema|film (?:night|screening)/, 'movies'],
  [/street ?food|food street|hawker|mamak/, 'streetfood'],
  // Before cafe: a brunch plan is about the table, not the coffee.
  [/brunch/, 'brunch'],
  [/\bcaf[eé]\b|coffee|kopi|matcha|latte/, 'cafe'],
  [/\bgym\b|fitness|crossfit|hiit|workout|strength|lift/, 'gym'],
  [/hike|hiking|trail|bukit|mountain|waterfall/, 'hike'],
  [/rooftop|sky ?bar/, 'rooftop'],
  [/\bbar\b|\bpub\b|cocktail|drinks|beer|wine|mixolog/, 'bar'],
  // TRX / The Exchange TRX (Tun Razak Exchange) — landmark photo of the Exchange 106
  // tower beats the generic restaurant shot for anything hosted at the mall.
  [/\btrx\b|tun razak exchange/, 'trx'],
  [/restaurant|dinner|lunch|makan|dining|foodie|feast/, 'restaurant'],
  [/\brun\b|running|\bjog\b|marathon|5k|10k|park run/, 'run'],
  [/yoga|pilates|stretch|breathwork/, 'yoga'],
  [/basketball|hoops/, 'basketball'],
  [/football|futsal|soccer|frisbee/, 'football'],
  [/climb|boulder|belay/, 'climb'],
  [/pottery|ceramic|\bclay\b|wheel throw/, 'pottery'],
  [/board ?games?|card games?/, 'games'],
  [/\bart\b|paint|draw|sketch|craft|creative studio/, 'art'],
  [/cowork|co-work|study|library|deep work|focus session/, 'cowork'],
];

// Vibe fallback — the marketing-grade email heroes already in public/images/email.
const VIBE_FALLBACK: Record<VibeKey, string> = {
  chill:     '/images/email/cafe-friends.jpg',
  focus:     '/images/email/cafe-friends.jpg',
  active:    '/images/email/fitness-class.jpg',
  adventure: '/images/email/asian-friends-park.jpg',
  creative:  '/images/email/friends-group.jpg',
  social:    '/images/email/friends-group.jpg',
};

// PF-46: a women-only plan's hero never shows men. These are the only images
// checked to show no people, or women only: art, basketball, cowork, pottery and
// trx have nobody in them; yoga, padel and golf are one woman (padel and golf
// checked 2026-10-12). Every other photo in the set shows men or people who can't
// be told apart (hands, distant figures). Re-check an image before adding it here.
const WOMEN_ONLY_SAFE = new Set(['art', 'basketball', 'cowork', 'golf', 'padel', 'pottery', 'trx', 'yoga']);
// Vibe fallback for a women-only plan no keyword matched; vibes without a safe
// photo get the pattern.
const WOMEN_ONLY_VIBE: Partial<Record<VibeKey, string>> = {
  focus: 'cowork',
  creative: 'art',
  active: 'yoga',
};
// Brand gradient + dot grid, no people (women-only.jpg, 1200²).
export const WOMEN_ONLY_PATTERN = '/images/activities/women-only.jpg';

function matchKey(rules: Array<[RegExp, string]>, ...parts: Array<string | null | undefined>): string | null {
  const hay = parts.filter(Boolean).join(' ').toLowerCase();
  for (const [re, key] of rules) {
    if (re.test(hay)) return key;
  }
  return null;
}

export function activityImage(opts: {
  vibe: VibeKey;
  venueName?: string | null;
  title?: string | null;
  purpose?: string | null;
  category?: string | null;
  // `user_availability.tags`: the hashtag plus hub keys and markers (cafe-hub,
  // test-seed), so only catalog slugs in HASHTAG_IMAGE count. Tags are free text
  // any signed-in user can write, hence the own-key check.
  tags?: string[] | null;
  womenOnly?: boolean;
}): string {
  const tagKey = opts.tags
    ?.map((tag) => String(tag).toLowerCase())
    .find((tag) => Object.hasOwn(HASHTAG_IMAGE, tag));
  const key = matchKey(EVENT_RULES, opts.venueName, opts.title, opts.purpose, opts.category)
    ?? (tagKey && HASHTAG_IMAGE[tagKey])
    ?? matchKey(KEYWORD_RULES, opts.venueName, opts.title)
    ?? matchKey(KEYWORD_RULES, opts.venueName, opts.title, opts.purpose, opts.category);
  if (key) {
    if (opts.womenOnly && !WOMEN_ONLY_SAFE.has(key)) return WOMEN_ONLY_PATTERN;
    return `/images/activities/${key}.jpg`;
  }
  if (opts.womenOnly) {
    const key = WOMEN_ONLY_VIBE[opts.vibe];
    return key ? `/images/activities/${key}.jpg` : WOMEN_ONLY_PATTERN;
  }
  return VIBE_FALLBACK[opts.vibe];
}
