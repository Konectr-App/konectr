// © Konectr 2026. All rights reserved.
// Proprietary and confidential.
//
// Paid-traffic attribution: capture utm_*/gclid/fbclid from the landing URL
// once per browser session, and attach them to the RSVP POST (the TestFlight
// and Android waitlist routes it also fed were removed 2026-11-17). Storage is sessionStorage so
// attribution survives the next-intl `/` → `/en` redirect and in-site
// navigation, but never outlives the visit (no consent needed — first-party,
// no cookies). The capture itself runs via ATTRIBUTION_SNIPPET in the root
// layout so it covers no-locale routes (/a, /r, /c) too.

const STORAGE_KEY = 'konectr_attribution';

const CAPTURED_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'fbclid',
] as const;

// Inline <script> for the root layout — plain JS, no React, runs on every
// route before any form can be submitted. First-touch per session: once an
// attributed landing is stored, later tagged navigations never overwrite it
// (the original acquisition source is the one that earns the conversion).
export const ATTRIBUTION_SNIPPET = `try {
  if (!sessionStorage.getItem('${STORAGE_KEY}')) {
    var p = new URLSearchParams(location.search);
    var keys = ${JSON.stringify(CAPTURED_PARAMS)};
    var out = {}; var hit = false;
    for (var i = 0; i < keys.length; i++) {
      var v = p.get(keys[i]);
      if (v) { out[keys[i]] = v.slice(0, 200); hit = true; }
    }
    if (hit) sessionStorage.setItem('${STORAGE_KEY}', JSON.stringify(out));
  }
} catch (e) {}`;

export interface UtmFields {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

/**
 * Read the captured attribution and normalize it to the three utm fields the
 * backend RPCs store. A bare gclid/fbclid (ad click with no utm tagging) is
 * mapped to the conventional source/medium so it still lands attributed.
 * SSR-safe: returns {} when sessionStorage is unavailable or empty.
 */
export function getUtmFields(): UtmFields {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const data = JSON.parse(raw) as Record<string, string>;
    const fields: UtmFields = {};
    if (data.utm_source) fields.utm_source = data.utm_source;
    else if (data.gclid) fields.utm_source = 'google';
    else if (data.fbclid) fields.utm_source = 'facebook';
    if (data.utm_medium) fields.utm_medium = data.utm_medium;
    else if (data.gclid || data.fbclid) fields.utm_medium = 'cpc';
    if (data.utm_campaign) fields.utm_campaign = data.utm_campaign;
    return fields;
  } catch {
    return {};
  }
}
