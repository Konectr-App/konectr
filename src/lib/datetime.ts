// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

// Canonical Malaysia-timezone (Asia/Kuala_Lumpur, fixed GMT+8, no DST) date/time
// helpers. Konectr is Malaysia-only: every activity time is displayed in MYT
// regardless of the viewer's device TZ or the render server (Vercel = UTC).
// Stored start_time/end_time values are true UTC — we always format them in MYT.
//
// Previously copy-pasted across /a/[code]/page.tsx, /a/[code]/ActivityRsvpPage.tsx,
// /a/[code]/cancel/page.tsx, /hyrox/page.tsx and
// /hyrox/HyroxContent.tsx; this module is now the single source.
//
// NOTE: WebChatPanel formats chat timestamps in the *viewer's* local TZ (no MYT
// pin, wrapped in try/catch) — that is a deliberately different helper and is
// intentionally NOT consolidated here.

export const MYT_TZ = 'Asia/Kuala_Lumpur';
export const MYT_OFFSET_MS = 8 * 60 * 60 * 1000;

// Returns a Date whose getUTC* fields read the Asia/KL wall-clock of `instant`, so
// day-boundary / hour arithmetic can use getUTC* deterministically (no DST in MY).
export function asMyt(instant: Date): Date {
  return new Date(instant.getTime() + MYT_OFFSET_MS);
}

// Returns a Date whose *local* fields (getFullYear/getMonth/getDate/getDay) read
// the Asia/KL wall-clock of `instant` (default: now). Used for week/countdown math
// on the hyrox page.
export function klWallClock(instant: Date = new Date()): Date {
  return new Date(instant.toLocaleString('en-US', { timeZone: MYT_TZ }));
}

// "7:00 PM" — activity time in MYT.
export function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit', hour12: true, timeZone: MYT_TZ,
  });
}

// "Fri, Jul 18" — weekday + short date in MYT.
export function formatWeekdayDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', timeZone: MYT_TZ,
  });
}

// "Jul 18" — short date in MYT.
export function formatShortDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', timeZone: MYT_TZ,
  });
}

// Natural-language relative day for the datetime card — "Tonight", "Tomorrow",
// "This Friday", "Next Wednesday", or the bare weekday for activities ≥2 weeks out
// (all MYT).
export function getRelativeDayPhrase(dateString: string): string {
  const d = asMyt(new Date(dateString));
  const now = asMyt(new Date());
  const startOfToday = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const target = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  const diffDays = Math.round((target - startOfToday) / 86_400_000);

  if (diffDays <= 0) return d.getUTCHours() >= 17 ? 'Tonight' : 'Today';
  if (diffDays === 1) return 'Tomorrow';
  const weekday = new Date(dateString).toLocaleDateString('en-US', { weekday: 'long', timeZone: MYT_TZ });
  if (diffDays <= 6) return `This ${weekday}`;
  if (diffDays <= 13) return `Next ${weekday}`;
  return weekday;
}

// Has the activity's end_time already passed?
export function isActivityEnded(endTime: string): boolean {
  return new Date(endTime) < new Date();
}

// Hours before start after which withdrawing counts as LATE. The spot is always
// released — "late" only means the group gets notified immediately. Mirrors the
// 3h cutoff enforced server-side in cancel_web_rsvp (the RPC stays authoritative).
export const LATE_WITHDRAWAL_CUTOFF_HOURS = 3;

// Is withdrawing now a LATE withdrawal (inside the cutoff)? Keeps the impure
// clock read out of the component render body; the RPC is the authoritative gate.
export function isLateWithdrawal(startTime: string): boolean {
  return (
    new Date(startTime).getTime() - new Date().getTime() <
    LATE_WITHDRAWAL_CUTOFF_HOURS * 60 * 60 * 1000
  );
}
