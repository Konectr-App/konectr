// © Konectr 2026. All rights reserved.
// Per-IP fixed-window rate limit for open write routes (Konectr/konectr-mvp#257).
//
// Ceiling: the state is in-memory, so it is per serverless instance and resets on a cold
// start. A determined bot spread across instances gets through; this stops the cheap
// single-source flood. The durable cap belongs in the RPCs (ip_hash, as create_web_rsvp does).

import type { NextRequest } from 'next/server';

type Window = { start: number; count: number };

const MAX_TRACKED_KEYS = 10_000;

export function createRateLimiter(limit: number, windowMs: number, now: () => number = Date.now) {
  const windows = new Map<string, Window>();

  return function allow(key: string): boolean {
    const t = now();
    const w = windows.get(key);
    if (!w || t - w.start >= windowMs) {
      // Bound memory: drop the oldest entry (Map keeps insertion order).
      if (!w && windows.size >= MAX_TRACKED_KEYS) {
        const oldest = windows.keys().next().value;
        if (oldest !== undefined) windows.delete(oldest);
      }
      windows.delete(key);
      windows.set(key, { start: t, count: 1 });
      return true;
    }
    if (w.count >= limit) return false;
    w.count += 1;
    return true;
  };
}

/** Client IP as Vercel reports it (first x-forwarded-for hop), or 'unknown'. */
export function clientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}
