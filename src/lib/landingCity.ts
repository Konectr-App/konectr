// © Konectr 2026. All rights reserved.
// Proprietary and confidential.
//
// City-aware landing links. A Threads post links to konectr.app/?c=bkk and the
// landing page speaks to that city. KL is the only city where the page says plans
// are running; every other city gets one honest line and no local plan claims.

export type CityKey = 'kl' | 'bkk' | 'bali' | 'cnx' | 'sg' | 'dn';

export const CITIES: Record<CityKey, string> = {
  kl: 'KL',
  bkk: 'Bangkok',
  bali: 'Bali',
  cnx: 'Chiang Mai',
  sg: 'Singapore',
  dn: 'Da Nang',
};

const STORAGE_KEY = 'konectr_city';

/** Read `c` from a query string. Unknown or missing values return null. */
export function parseCity(search: string): CityKey | null {
  const raw = new URLSearchParams(search).get('c');
  if (!raw) return null;
  const key = raw.trim().toLowerCase();
  return key in CITIES ? (key as CityKey) : null;
}

/** City for this visit: the link wins, then the one stored earlier in the session. */
export function resolveCity(search: string): CityKey | null {
  const fromLink = parseCity(search);
  try {
    if (fromLink) {
      sessionStorage.setItem(STORAGE_KEY, fromLink);
      return fromLink;
    }
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored && stored in CITIES ? (stored as CityKey) : null;
  } catch {
    return fromLink;
  }
}

const clean = (value: string, fallback: string) =>
  value.toLowerCase().replace(/[^a-z0-9_.-]/g, '').slice(0, 40) || fallback;

export interface Campaign {
  /** Which button or surface sent the visitor, e.g. home_hero, qr. */
  source: string;
  city?: CityKey | null;
  /** First-touch utm_source of the visit, e.g. threads. */
  utmSource?: string;
}

/**
 * Tag a store link so installs can be traced to the page. Google Play reads
 * `referrer` with no setup. The App Store needs a provider token (`pt`) from
 * App Store Connect, so the iOS link is left alone until that env var is set.
 */
export function withCampaign(url: string, store: 'ios' | 'android', campaign: Campaign): string {
  const source = clean(campaign.source, 'landing');
  const city = campaign.city ?? 'all';
  try {
    const out = new URL(url);
    if (store === 'android') {
      const referrer = new URLSearchParams({
        utm_source: clean(campaign.utmSource ?? '', 'konectr.app'),
        utm_medium: 'web',
        utm_campaign: city,
        utm_content: source,
      });
      out.searchParams.set('referrer', referrer.toString());
      return out.toString();
    }
    const pt = process.env.NEXT_PUBLIC_APPLE_PROVIDER_TOKEN;
    if (!pt) return url;
    out.searchParams.set('pt', pt);
    out.searchParams.set('ct', `${source}-${city}`.slice(0, 40));
    out.searchParams.set('mt', '8');
    return out.toString();
  } catch {
    return url;
  }
}
