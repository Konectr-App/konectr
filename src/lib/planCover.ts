// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

// A plan's cover (Konectr-App/konectr-mvp#736). Kept apart from supabase.ts
// so metadata and tests can use it without creating a client.

const COVER_PATH = /^[0-9a-f-]{36}\/[0-9a-f]{32}\.jpg$/;

/** The public URL of a plan's cover, or null when there is none (or the path
 *  isn't one the app writes: `<activity_id>/<32 hex>.jpg`). */
export function planCoverUrl(coverPath: string | null | undefined): string | null {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base || !coverPath || !COVER_PATH.test(coverPath)) return null;
  return `${base}/storage/v1/object/public/activity-covers/${coverPath}`;
}

/** The hero's CSS `object-position` for a cover's focal point (#825). x and y
 *  run 0..1 from the left and top edges; a null, missing or out-of-range value
 *  is the centre of that axis. */
export function coverObjectPosition(x: number | null | undefined, y: number | null | undefined): string {
  return `${focalPercent(x)}% ${focalPercent(y)}%`;
}

function focalPercent(v: number | null | undefined): number {
  if (typeof v !== 'number' || !Number.isFinite(v) || v < 0 || v > 1) return 50;
  return Math.round(v * 10000) / 100;
}
