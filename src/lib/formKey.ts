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
 * True when the request may go on. With no key configured the check is off, so a deploy
 * without the env var behaves exactly as before.
 */
export function formKeyOk(expected: string | undefined, given: string | null | undefined): boolean {
  if (!expected) return true;
  if (!given) return false;
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(given, 'utf8');
  // timingSafeEqual throws on unequal lengths, and the length itself is not the secret.
  return a.length === b.length && timingSafeEqual(a, b);
}
