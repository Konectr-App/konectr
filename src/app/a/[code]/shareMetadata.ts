// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import type { Metadata } from 'next';
import type { SharedActivity } from '@/lib/supabase';
import { SHARE_OG_IMAGE } from '@/lib/metadata';
import { formatWeekdayDate, formatTime } from '@/lib/datetime';

// PF-46: previews get forwarded, so a women-only plan's card never carries the
// title, venue, time or starter. Same for <title> and the meta description.
export const WOMEN_ONLY_SHARE_TITLE = 'A women-only activity on Konectr';
export const WOMEN_ONLY_SHARE_DESCRIPTION = 'Open to women only. RSVP to see when and where.';

// Metadata for /a/[code]. Pure (no fetch) so it can be tested on the RPC's
// exact payloads; page.tsx's generateMetadata fetches and calls this.
export function buildShareMetadata(activity: SharedActivity | null, code: string): Metadata {
  // A dead or mistyped share code still gets pasted into WhatsApp, so this
  // branch needs the preview card too.
  if (!activity) {
    return {
      title: 'Activity Not Found - Konectr',
      description: 'This activity could not be found.',
      openGraph: {
        title: 'Konectr',
        description: 'This activity could not be found.',
        url: `https://konectr.app/a/${code}`,
        type: 'website',
        images: [SHARE_OG_IMAGE],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Konectr',
        description: 'This activity could not be found.',
        images: [SHARE_OG_IMAGE.url],
      },
    };
  }

  // Keyed on women_only, not redacted: even a payload that came back unredacted
  // must not put the plan into a forwardable preview. noindex keeps the page
  // out of search; the sitemap already excludes it server-side.
  if (activity.women_only || activity.redacted) {
    return {
      title: WOMEN_ONLY_SHARE_TITLE,
      description: WOMEN_ONLY_SHARE_DESCRIPTION,
      robots: { index: false, follow: false },
      alternates: {
        canonical: `https://konectr.app/a/${code}`,
      },
      openGraph: {
        title: WOMEN_ONLY_SHARE_TITLE,
        description: WOMEN_ONLY_SHARE_DESCRIPTION,
        url: `https://konectr.app/a/${code}`,
        type: 'website',
        images: [SHARE_OG_IMAGE],
      },
      twitter: {
        card: 'summary_large_image',
        title: WOMEN_ONLY_SHARE_TITLE,
        description: WOMEN_ONLY_SHARE_DESCRIPTION,
        images: [SHARE_OG_IMAGE.url],
      },
    };
  }

  const venueName = activity.venue_name || 'TBD';
  const currentParticipants = Number(activity.current_participants);
  // Spots framing matches the landing page + share message ("X spots left"), not
  // "joined/cap" — "0/10 spots" read as if the activity were empty/unavailable.
  const spotsLeft = Math.max(0, activity.max_participants - currentParticipants);
  const spotsText = activity.max_participants > 0
    ? (spotsLeft === 0 ? 'Full' : `${spotsLeft} ${spotsLeft === 1 ? 'spot' : 'spots'} left`)
    : `${activity.current_participants} joined`;
  // A mixed plan always has a start time; the guard only keeps a malformed row
  // from rendering "Invalid Date".
  const when = activity.start_time
    ? `${formatWeekdayDate(activity.start_time)}, ${formatTime(activity.start_time)} at `
    : 'At ';
  const richDescription = `${when}${venueName} · ${spotsText} · Join ${activity.creator_name} on Konectr`;

  return {
    title: `${activity.title} - Join on Konectr`,
    description: richDescription,
    alternates: {
      canonical: `https://konectr.app/a/${code}`,
    },
    openGraph: {
      title: `${activity.title} - Konectr`,
      description: richDescription,
      url: `https://konectr.app/a/${code}`,
      type: 'website',
      images: [SHARE_OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${activity.title} - Konectr`,
      description: richDescription,
      images: [SHARE_OG_IMAGE.url],
    },
  };
}
