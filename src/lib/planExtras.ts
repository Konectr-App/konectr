// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

// A Captain's extras on a plan, as `get_activity_by_share_code` returns them
// (Konectr-App/konectr-mvp#812). Same rules as the app's
// `lib/features/ring_kit/plan_extras.dart`; the server (`set_plan_extras`)
// is the gate on write, and this re-checks on read so a malformed or
// non-https row never becomes a link on a public page.

export const MAX_PLAN_LINKS = 3;
export const MAX_PLAN_LINK_LABEL = 40;
export const MAX_PLAN_LINK_URL = 300;
export const MAX_PAID_NOTE = 40;

export interface PlanLink {
  label: string;
  /** Always https. */
  url: string;
  /** The URL as shown under the label: no scheme, no trailing slash. */
  shortUrl: string;
}

function parseLink(raw: unknown): PlanLink | null {
  if (!raw || typeof raw !== 'object') return null;
  const { label, url } = raw as { label?: unknown; url?: unknown };
  if (typeof label !== 'string' || typeof url !== 'string') return null;
  const l = label.trim();
  const u = url.trim();
  if (!l || l.length > MAX_PLAN_LINK_LABEL) return null;
  if (!u || u.length > MAX_PLAN_LINK_URL || /\s/.test(u)) return null;
  let parsed: URL;
  try {
    parsed = new URL(u);
  } catch {
    return null;
  }
  if (parsed.protocol !== 'https:' || !parsed.hostname.includes('.')) return null;
  // No credentials in a link shown to strangers ("https://bank.com@evil.io").
  if (parsed.username || parsed.password) return null;
  return {
    label: l,
    url: parsed.toString(),
    shortUrl: u.replace(/^https:\/\//i, '').replace(/\/$/, ''),
  };
}

/** The plan's links, at most three, dropping anything that isn't a clean https link. */
export function planLinks(raw: unknown): PlanLink[] {
  if (!Array.isArray(raw)) return [];
  const out: PlanLink[] = [];
  for (const item of raw) {
    const link = parseLink(item);
    if (link) out.push(link);
    if (out.length === MAX_PLAN_LINKS) break;
  }
  return out;
}

/**
 * The tag on the plan: "Paid" or "Paid · RM 25 at the gym". Null on a free
 * plan: every plan is free unless its Captain marks it paid, so Free needs
 * no tag (same as the app).
 */
export function paidTag(isPaid: unknown, paidNote: unknown): string | null {
  if (isPaid !== true) return null;
  const note = typeof paidNote === 'string' ? paidNote.trim().slice(0, MAX_PAID_NOTE) : '';
  return note ? `Paid · ${note}` : 'Paid';
}
