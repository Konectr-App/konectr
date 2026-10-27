// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

// Activity-type image library. The vibe is locked (colour/emoji/name), but the HERO
// IMAGE keys to the *specific* activity/venue — padel → padel, cafe → cafe, hike →
// trail — so the photo actually complements what people are matching into. Falls back
// to the vibe-level photo when no specific type is detected.
//
// Assets live in public/images/activities/. To add a type: drop <key>.jpg in that
// folder and add a keyword row below. Curate/replace with licensed or venue-supplied
// photography over time (see PADEL note).

import type { VibeKey } from './vibes';

// Keyword → image key, checked in order (most specific first). Two passes, lowercased:
// venue name + title first, then with purpose + category added. The title says what
// the plan is; the purpose often names side things ("dinner after", "skipped bowling?
// join anyway") that would otherwise steal the photo.
const KEYWORD_RULES: Array<[RegExp, string]> = [
  // ⚠️ PADEL: no true padel stock asset yet (glass-court sport). Using the tennis
  // court as the closest racquet-sport proxy — swap in a real ASCARO/venue padel
  // photo at public/images/activities/padel.jpg and change 'tennis' → 'padel' here.
  [/\bpadel\b/, 'tennis'],
  // Indoor batting cages (e.g. "SWING FOR IT — BASEBALL CAGE!" @ Swing! Batting
  // Centre, Melawati Mall). baseball.jpg = founder-supplied indoor cage photo (1200²).
  [/baseball|softball|batting/, 'baseball'],
  // Ten-pin bowling (e.g. "STRIKES, SPARES & NEW FRIENDS!" @ Supreme Bowl, Mid Valley).
  // Never bare "bowl": live plans say "a bowl of ramen" and "acai bowls".
  // bowling.jpg = Unsplash MdN5h3QCiTw by Brittani Burns (Unsplash License), 1200×1500.
  [/bowling|ten-?pin|🎳|mega ?lanes|\b(?:cosmic|supreme) ?bowl\b|superbowl/, 'bowling'],
  // Nights of Fright (Sunway Lagoon Halloween festival, e.g. "Night of Frights! 12 @
  // Sunway Lagoon", share 395AAF96). nights-of-fright.jpg = founder-made event poster
  // (1080×1440). Keyed to the event name, not the venue: Sunway Lagoon also hosts
  // daytime water-park plans that must not get a horror poster.
  [/nights? of frights?/, 'nights-of-fright'],
  // Safehouse Sky Society KL (Jalan Raja Chulan), e.g. "SKY HIGH SUNDAY SOCIAL!"
  // (share 31125EB1). Keyed to the venue: its plans say "rooftop cafe", which the
  // cafe rule would take. safehouse.jpg = founder-supplied venue interior (786×1048).
  [/safehouse sky society/, 'safehouse'],
  [/badminton|shuttle/, 'badminton'],
  [/tennis|squash/, 'tennis'],
  [/\bcaf[eé]\b|coffee|kopi|matcha|brunch|latte/, 'cafe'],
  [/\bgym\b|fitness|crossfit|hiit|workout|strength|lift/, 'gym'],
  [/hike|hiking|trail|bukit|mountain|waterfall|kayak/, 'hike'],
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
// checked (2026-10-11) to show no people, or women only: art, basketball, cowork,
// pottery and trx have nobody in them; yoga is one woman. Every other photo in
// the set shows men or people who can't be told apart (hands, distant figures).
// Re-check an image before adding it here.
const WOMEN_ONLY_SAFE = new Set(['art', 'basketball', 'cowork', 'pottery', 'trx', 'yoga']);
// Vibe fallback for a women-only plan no keyword matched; vibes without a safe
// photo get the pattern.
const WOMEN_ONLY_VIBE: Partial<Record<VibeKey, string>> = {
  focus: 'cowork',
  creative: 'art',
  active: 'yoga',
};
// Brand gradient + dot grid, no people (women-only.jpg, 1200²).
export const WOMEN_ONLY_PATTERN = '/images/activities/women-only.jpg';

function matchKey(...parts: Array<string | null | undefined>): string | null {
  const hay = parts.filter(Boolean).join(' ').toLowerCase();
  for (const [re, key] of KEYWORD_RULES) {
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
  womenOnly?: boolean;
}): string {
  const key = matchKey(opts.venueName, opts.title)
    ?? matchKey(opts.venueName, opts.title, opts.purpose, opts.category);
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
