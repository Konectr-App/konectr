// © Konectr 2026. All rights reserved.
// Shared-secret check for the founder-only venue interview form (Konectr-App/konectr-mvp#257).
//
// The form writes straight to Notion and needs no login, so anyone who finds the URL can fill
// the database. Setting INTERVIEW_FORM_KEY on Vercel turns this check on; the form then asks
// for the key once and remembers it on that device.
//
// Ceiling: one shared key, kept in the browser's localStorage on the founder's phone. It stops
// strangers, not someone holding that phone. Rotate by changing the env var.

import { timingSafeEqual } from 'node:crypto';

/** Header the form sends the key in. */
export const FORM_KEY_HEADER = 'x-interview-form-key';

/**
 * The key as the form sent it. The form percent-encodes it, because a header can only carry
 * Latin-1: a key with an emoji or a curly quote would otherwise make the browser refuse to
 * send the request at all. A value that isn't valid percent-encoding is taken as typed.
 */
export function readFormKey(headerValue: string | null | undefined): string | null {
  if (!headerValue) return null;
  try {
    return decodeURIComponent(headerValue);
  } catch {
    return headerValue;
  }
}

/**
 * True when a key is configured, read the way formKeyOk reads it. The page uses this to decide
 * whether to show the key field, so the field and the check cannot disagree: a value that is
 * only whitespace is "no key" for both. Before this the page used Boolean(env), which showed
 * the field for a whitespace-only value while the check was off.
 */
export function formKeyRequired(expected: string | undefined): boolean {
  return Boolean(expected?.trim());
}

/**
 * True when the request may go on. With no key configured the check is off, so a deploy
 * without the env var behaves exactly as before.
 *
 * Both sides are trimmed: an env var saved with a trailing newline (`echo` adds one) would
 * otherwise refuse every key, since a header never carries trailing whitespace.
 */
export function formKeyOk(expected: string | undefined, given: string | null | undefined): boolean {
  const want = expected?.trim();
  const got = given?.trim();
  if (!want) return true;
  if (!got) return false;
  const a = Buffer.from(want, 'utf8');
  const b = Buffer.from(got, 'utf8');
  // timingSafeEqual throws on unequal lengths, and the length itself is not the secret.
  return a.length === b.length && timingSafeEqual(a, b);
}
