// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type for activity from get_activity_by_share_code RPC.
//
// PF-46: a women-only plan the viewer can't see comes back `redacted: true`. The
// web is always anonymous, so on this site every women-only plan is redacted
// until the guest RSVPs. Redacted rows null out user_id, title (only when it
// would name the place: equal to the venue, the location text or "New Activity"),
// description, details, venue_name, start_time, end_time, current_participants
// (founder pick R5: no crew count) and the starter's name and photo. Lat/lng are
// rounded to 2 decimals, not nulled: never render them as a pin.
export interface SharedActivity {
  id: string;
  user_id: string | null;
  title: string | null;
  description: string | null;
  details: string | null; // "Here for…" purpose text (description is legacy, empty since build 38)
  category: string;
  venue_type: string | null;
  venue_name: string | null;
  location_lat: number | null;
  location_lng: number | null;
  start_time: string | null;
  end_time: string | null;
  max_participants: number;
  current_participants: number | null;
  status: string;
  share_code: string;
  creator_name: string | null;
  creator_photo_url: string | null;
  women_only: boolean;
  redacted: boolean;
  /** "Saturday evening" in KL time. Set on every row, redacted or not. */
  day_part: string | null;
  /** The plan's city (`user_availability.city`); null on most plans. */
  area: string | null;
  /** `user_availability.tags` (hashtag + hub keys). Not returned by the RPC yet;
   *  once it is, the hero uses the hashtag's photo instead of keyword matching. */
  tags?: string[] | null;
}

// Fetch activity by share code
export async function getActivityByShareCode(shareCode: string): Promise<SharedActivity | null> {
  try {
    const { data, error } = await supabase.rpc('get_activity_by_share_code', {
      p_share_code: shareCode.toUpperCase(),
    });

    if (error) {
      console.error('Supabase RPC error:', error);
      return null;
    }

    // RPC returns an array, get the first result
    if (!data || (Array.isArray(data) && data.length === 0)) {
      console.log('No activity found for share code:', shareCode);
      return null;
    }

    // Return first result if array, otherwise return as-is. A redacted
    // women-only plan is returned as-is: callers render the locked state.
    const activity = Array.isArray(data) ? data[0] : data;
    return activity as SharedActivity;
  } catch (err) {
    console.error('Error fetching activity:', err);
    return null;
  }
}

// ============================================================================
// Web RSVP Types & Helpers
// ============================================================================

/**
 * The venue and time of a women-only plan, released to a guest once she has
 * RSVP'd (PF-46, the D5 unlock). `create_web_rsvp` returns it as `activity`
 * (no title); `get_web_guest_plan` returns it on reload (with title).
 */
export interface UnlockedPlan {
  venue_name: string | null;
  start_time: string;
  end_time: string;
  location_lat: number | null;
  location_lng: number | null;
  details: string | null;
  title?: string | null;
}

export interface WebRsvpResponse {
  /** Short RSVP-XXXX code: only redeemable in the app by a signed-in user. */
  claim_token: string;
  /** 32-byte web credential for chat, headcount and cancel (audit C2). */
  guest_token: string;
  guest_name: string;
  activity_title: string;
  participant_count: number;
  /** May contain nulls — a participant whose profile has no display_name yet. */
  participant_names: (string | null)[];
  spots_remaining: number;
  message_count: number;
  /** Present (true) only on a women-only plan, together with `activity`. */
  women_only?: boolean;
  activity?: UnlockedPlan;
}

export interface RsvpTeaserResponse {
  /** Null on a women-only plan: the web viewer is anonymous, so never eligible. */
  participant_count: number | null;
  /** May contain nulls — a participant whose profile has no display_name yet. */
  participant_names: (string | null)[];
  creator_name: string;
  spots_remaining: number | null;
  max_participants: number;
  message_count: number;
  women_only?: boolean;
}

export async function createWebRsvp(
  activityId: string,
  guestName: string,
  ipHash: string | null,
  phoneHash: string | null = null,
  email: string | null = null,
  utm: { utm_source?: string | null; utm_medium?: string | null; utm_campaign?: string | null } = {},
  attestWoman = false
): Promise<WebRsvpResponse> {
  const { data, error } = await supabase.rpc('create_web_rsvp', {
    p_activity_id: activityId,
    p_guest_name: guestName,
    p_ip_hash: ipHash,
    p_phone_hash: phoneHash,
    p_email: email,
    p_utm_source: utm.utm_source ?? null,
    p_utm_medium: utm.utm_medium ?? null,
    p_utm_campaign: utm.utm_campaign ?? null,
    // Sent only when ticked, so a mixed-plan call stays the 8-argument call it
    // was before PF-46 (the parameter defaults to false server-side).
    ...(attestWoman ? { p_attest_woman: true } : {}),
  });

  if (error) {
    throw new Error(error.message);
  }

  return data as WebRsvpResponse;
}

// Row from get_web_guest_plan(p_guest_token): the plan behind a guest token,
// or null when the token is unknown or the RSVP is no longer pending/claimed
// (withdrawn, or removed from a women-only plan by its starter).
export interface WebGuestPlan extends UnlockedPlan {
  activity_id: string;
  share_code: string;
  title: string | null;
  women_only: boolean;
}

/** Throws on an RPC error, so callers can tell "no access" (null) from an outage. */
export async function getWebGuestPlan(guestToken: string): Promise<WebGuestPlan | null> {
  const { data, error } = await supabase.rpc('get_web_guest_plan', {
    p_guest_token: guestToken,
  });
  if (error) {
    throw new Error(error.message);
  }
  return (data as WebGuestPlan) ?? null;
}

// Result of cancel_web_rsvp RPC. The spot is ALWAYS released; `late` (inside the
// 3h cutoff, enforced server-side) only means the group was notified immediately.
export interface CancelWebRsvpResult {
  outcome:
    | 'withdrawn'        // spot freed (always)
    | 'already_withdrawn'
    | 'activity_unavailable'
    | 'not_found'
    | 'rate_limited';
  late?: boolean;
}

export async function cancelWebRsvp(
  guestToken: string,
  ipHash: string | null
): Promise<CancelWebRsvpResult> {
  const { data, error } = await supabase.rpc('cancel_web_rsvp', {
    p_claim_token: guestToken,
    p_ip_hash: ipHash,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data as CancelWebRsvpResult;
}

// ?v= on an RSVP email link proves the mailbox owner opened it — the gate that
// lets the app auto-claim this RSVP when they sign up with that email.
export async function verifyWebRsvpEmail(token: string): Promise<void> {
  await supabase.rpc('verify_web_rsvp_email', { p_token: token });
}

// ============================================================================
// Public Weekly Leaderboard (KL)
// ============================================================================

// Row from get_public_leaderboard RPC (anon-callable, opt-in users only).
// Weekly aggregates ONLY — no venues, dates, or lifetime counts by privacy design.
export interface LeaderboardEntry {
  rank: number;
  first_name: string;
  photo_url: string | null;
  score: number;
  verified_meetups: number; // completed activities (distinct, credited to this user) — the ranking key
  is_champion: boolean;
  week_start: string; // KL-local Monday (date)
  week_end: string;   // KL-local Sunday (date)
}

// weekOffset: 0 = current week (live), -1 = last week (final). Clamped server-side.
export async function getPublicLeaderboard(weekOffset: 0 | -1): Promise<LeaderboardEntry[]> {
  try {
    const { data, error } = await supabase.rpc('get_public_leaderboard', {
      p_week_offset: weekOffset,
    });

    if (error) {
      console.error('Leaderboard RPC error:', error);
      return [];
    }

    return (data as LeaderboardEntry[]) ?? [];
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    return [];
  }
}

// ============================================================================
// Campaign by-tag reads (HYROX KL Dec 2026 — konectr.app/hyrox)
// ============================================================================

// Row from get_venues_by_tag RPC (anon-callable). Non-sensitive venue business
// data only — no owner contact fields (see migration 20260716000100).
export interface CampaignVenue {
  venue_id: string;
  venue_name: string;
  address: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  category: string | null;
  photo_url: string | null;
  website: string | null;
  google_place_id: string | null;
  tags: string[];
}

// Row from get_public_activities_by_tag RPC (anon-callable). Same field surface
// as the share-code teaser RPCs, bounded to public + active + upcoming.
export interface CampaignActivity {
  id: string;
  share_code: string;
  title: string;
  details: string | null; // "Here for…" purpose text
  venue_id: string | null;
  venue_name: string | null;
  venue_type: string | null;
  location_lat: number | null;
  location_lng: number | null;
  start_time: string;
  end_time: string;
  max_participants: number;
  spots_available: number;
  creator_display_name: string | null;
  tags: string[];
}

// Row from get_active_campaign RPC (anon-callable). Marketing config for the
// active campaign instance — no PII. Decouples the generic 'hyrox' tag from the
// KL Dec 2026 instance (see migration 20260722000000_campaigns_config).
export interface Campaign {
  campaign_key: string;
  tag_name: string;
  certified_tag: string | null;
  style_tag: string | null;
  race_name: string;
  short_label: string;
  date_label: string;
  venue_label: string;
  venue_short_label: string;
  city: string | null;
  city_order: string[];
  event_start: string;
  event_end: string;
  sponsor: string | null;
  feature_flag_key: string;
  interest_name: string;
  disclaimer: string;
  country: string | null;
  // Added by 20260813090000_campaign_hub_generalization. Absent from the
  // legacy get_active_campaign RPC — treat as optional.
  kind?: 'event' | 'evergreen';
  hub_config?: Record<string, unknown>;
}

export async function getActiveCampaign(): Promise<Campaign | null> {
  try {
    const { data, error } = await supabase.rpc('get_active_campaign');

    if (error) {
      console.error('get_active_campaign RPC error:', error);
      return null;
    }

    const rows = (data as Campaign[]) ?? [];
    return rows.length > 0 ? rows[0] : null;
  } catch (err) {
    console.error('Error fetching active campaign:', err);
    return null;
  }
}

// One active campaign by campaign_key — backs the /c/[key] hub landing pages
// (get_campaign_by_key RPC, anon-callable, added by the hub generalization
// migration; returns null until that migration is applied).
export async function getCampaignByKey(key: string): Promise<Campaign | null> {
  try {
    const { data, error } = await supabase.rpc('get_campaign_by_key', {
      p_key: key,
    });

    if (error) {
      console.error('get_campaign_by_key RPC error:', error);
      return null;
    }

    const rows = (data as Campaign[]) ?? [];
    return rows.length > 0 ? rows[0] : null;
  } catch (err) {
    console.error('Error fetching campaign by key:', err);
    return null;
  }
}

export async function getVenuesByTag(tag: string): Promise<CampaignVenue[]> {
  try {
    const { data, error } = await supabase.rpc('get_venues_by_tag', {
      p_tag: tag,
    });

    if (error) {
      console.error('get_venues_by_tag RPC error:', error);
      return [];
    }

    return (data as CampaignVenue[]) ?? [];
  } catch (err) {
    console.error('Error fetching venues by tag:', err);
    return [];
  }
}

export async function getPublicActivitiesByTag(tag: string): Promise<CampaignActivity[]> {
  try {
    const { data, error } = await supabase.rpc('get_public_activities_by_tag', {
      p_tag: tag,
    });

    if (error) {
      console.error('get_public_activities_by_tag RPC error:', error);
      return [];
    }

    return (data as CampaignActivity[]) ?? [];
  } catch (err) {
    console.error('Error fetching public activities by tag:', err);
    return [];
  }
}

export interface UpcomingPlan {
  share_code: string;
  title: string;
  venue_name: string | null;
  venue_type: string | null;
  start_time: string;
  spots_available: number;
}

/**
 * Up to `limit` joinable public plans in the next 14 days, for the ended /
 * not-found states of /a/[code]. Returns [] on any error — including before the
 * get_public_upcoming_plans migration is applied — so the page degrades to the
 * plain ended card instead of breaking.
 */
export async function getUpcomingPublicPlans(excludeShareCode: string, limit = 3): Promise<UpcomingPlan[]> {
  try {
    const { data, error } = await supabase.rpc('get_public_upcoming_plans', {
      p_exclude_share_code: excludeShareCode,
      p_limit: limit,
    });
    if (error) return [];
    return (data as UpcomingPlan[]) ?? [];
  } catch {
    return [];
  }
}

/**
 * The plans we let search and answer engines index: sitemap entries + Event
 * JSON-LD on /a/[code]. Same public / non-residential / has-spots filter as the
 * ended-plan suggestions, because get_activity_by_share_code has no is_public
 * check. ponytail: the RPC caps at 6 soonest plans; raise the cap if supply
 * ever outgrows it.
 */
export function getIndexablePlans(): Promise<UpcomingPlan[]> {
  return getUpcomingPublicPlans('', 6);
}

/**
 * Drops nulls/blanks from a participant-name list.
 *
 * `get_activity_rsvp_teaser` builds names with `split_part(display_name, ' ', 1)`,
 * and an app member who has not finished onboarding has a NULL `display_name` —
 * `split_part(NULL, …)` is NULL, and `jsonb_agg` keeps it as a JSON null. One such
 * member in an activity used to take the whole /a/[code] page down with a
 * TypeError on `name.trim()`. The RPC is fixed too, but the page must never again
 * depend on the server for this: unnamed people are counted, not named.
 */
export function cleanParticipantNames(names: (string | null)[] | null | undefined): string[] {
  if (!Array.isArray(names)) return [];
  return names.filter((n): n is string => typeof n === 'string' && n.trim().length > 0);
}

export async function getActivityRsvpTeaser(
  activityId: string
): Promise<RsvpTeaserResponse | null> {
  try {
    const { data, error } = await supabase.rpc('get_activity_rsvp_teaser', {
      p_activity_id: activityId,
    });

    if (error) {
      console.error('RSVP teaser error:', error);
      return null;
    }

    return data as RsvpTeaserResponse;
  } catch (err) {
    console.error('Error fetching RSVP teaser:', err);
    return null;
  }
}

// ── Konectr Hub public page (/h/[slug], PF-45) ──────────────────────────────
// Shape of get_public_hub_page(p_slug) — anon-granted, hubs_009. Only returns
// venues that are is_konectr_hub AND is_active; approved photos only; public
// plans in the next 14 days as counts + share_code (no user ids, no names).
export interface PublicHubAnnouncement {
  id: string;
  body: string;
  expires_at: string;
  image_url: string | null;
}

export interface PublicHubPlan {
  title: string;
  category: string | null;
  start_time: string;
  share_code: string | null;
  headcount: number | null; // only when ≥3 people
  headcount_label: 'small_group' | null;
  spots_left: number | null;
}

export interface PublicHubPage {
  name: string;
  slug: string;
  city: string | null;
  category: string | null;
  description: string | null;
  photo_url: string | null;
  photos: string[];
  hours: { day_of_week: number; open_time: string | null; close_time: string | null; is_closed: boolean }[];
  links: { instagram: string | null; tiktok: string | null; maps: string | null };
  good_for: string[];
  announcements: { this_week: PublicHubAnnouncement[]; this_month: PublicHubAnnouncement[] };
  perks: { min_group: number; title: string }[];
  plans: PublicHubPlan[];
}

/**
 * null = not a live Hub. The RPC raises P0002 `hub_not_found` for an unknown,
 * inactive or non-Hub slug, which PostgREST returns as HTTP 500 — that is a
 * 404, not an outage. Any OTHER error throws, so ISR keeps serving the last
 * good page instead of caching a false 404 during a Supabase blip.
 */
export async function getPublicHubPage(slug: string): Promise<PublicHubPage | null> {
  // Same slug rule as the RPC; saves a round-trip for junk paths.
  if (slug.length > 80 || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) return null;
  const { data, error } = await supabase.rpc('get_public_hub_page', { p_slug: slug });
  if (error) {
    if (error.code === 'P0002') return null;
    throw new Error(`get_public_hub_page failed: ${error.code} ${error.message}`);
  }
  return (data as PublicHubPage) ?? null;
}

/** Live Hub slugs for sitemap.xml (get_public_hub_slugs, anon). Empty on error: a sitemap never fails the build. */
export async function getPublicHubSlugs(): Promise<{ slug: string; updated_at: string }[]> {
  const { data, error } = await supabase.rpc('get_public_hub_slugs');
  if (error) {
    console.error('get_public_hub_slugs failed', error.code, error.message);
    return [];
  }
  return data ?? [];
}
