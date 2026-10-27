'use client';

// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import { useState, useEffect, useCallback } from 'react';
import type { SharedActivity, UpcomingPlan, UnlockedPlan } from '@/lib/supabase';
import {
  getActivityRsvpTeaser,
  getWebGuestPlan,
  cleanParticipantNames,
  verifyWebRsvpEmail,
  type RsvpTeaserResponse,
} from '@/lib/supabase';
import { detectPlatform, getSmartProfileLinkProps, type Platform } from '@/lib/smartLink';
import { isValidEmail } from '@/lib/utils';
import { getUtmFields } from '@/lib/attribution';
import { copyText } from '@/lib/copyText';
import {
  formatTime,
  getRelativeDayPhrase,
  formatShortDate,
  isLateWithdrawal,
} from '@/lib/datetime';
import {
  getStoredRsvp,
  storeRsvp,
  removeStoredRsvp,
  getStoredUserProfile,
  storeUserProfile,
  type StoredRsvp,
} from '@/lib/rsvpStorage';
import { countryCodes } from './countryCodes';
import StoreCTAs from '@/components/StoreCTAs';
import WebChatPanel from './WebChatPanel';
import WebHeadcountCard from './WebHeadcountCard';
import { resolveVibe } from './redesign/vibes';
import { activityImage } from './redesign/activity-images';
import RsvpLayout from './redesign/RsvpLayout';
import ClaimScreen from './redesign/ClaimScreen';
import ChattingScreen from './redesign/ChattingScreen';
import WithdrawSheet from './redesign/WithdrawSheet';
import SimpleStateLayout from './redesign/SimpleStateLayout';
import { isPlanNotHappening, isPlanOver } from './planStatus';

// The web RSVP is this site's main conversion; before 2026-09-26 it fired no
// PostHog event, so share-link → RSVP could not be funnelled. No PII: the share
// code identifies the plan, not the guest.
function trackRsvp(event: string, props: Record<string, unknown>) {
  try {
    (window as unknown as { posthog?: { capture?: (e: string, p?: Record<string, unknown>) => void } })
      .posthog?.capture?.(event, props);
  } catch {
    // tracking must never block the RSVP
  }
}
import OpenInApp from './redesign/OpenInApp';

interface Props {
  activity: SharedActivity | null;
  shareCode: string;
  // Inside the 3h cutoff → late withdrawal? Computed server-side (render-pure);
  // the spot is always released, RPC stays authoritative.
  isLate?: boolean;
  // Next joinable public plans, fetched server-side only for ended / not-found.
  upcomingPlans?: UpcomingPlan[];
}

export default function ActivityRsvpPage({ activity, shareCode, isLate = false, upcomingPlans = [] }: Props) {
  const [rsvpState, setRsvpState] = useState<'loading' | 'pre-rsvp' | 'post-rsvp'>('loading');
  const [storedRsvp, setStoredRsvp] = useState<StoredRsvp | null>(null);
  // True only for the session in which the claim was submitted — a refresh
  // remounts the page and restores from localStorage with this false, so the
  // celebration banner shows once, not on every return visit.
  const [justClaimed, setJustClaimed] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+60');
  const [email, setEmail] = useState('');
  // Phone is optional — collapsed unless this device already saved one.
  const [showPhone, setShowPhone] = useState(false);
  // A previous RSVP left name + email on this device → offer one-tap instead of
  // a form. `editing` is the escape hatch behind "Edit →".
  const [hasStoredIdentity, setHasStoredIdentity] = useState(false);
  const [editing, setEditing] = useState(false);
  const [emailBlurred, setEmailBlurred] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [teaserData, setTeaserData] = useState<RsvpTeaserResponse | null>(null);
  const [platform, setPlatform] = useState<Platform | null>(null);
  // Withdraw-my-RSVP flow — spot always released; 3h cutoff (late) enforced server-side.
  const [cancelPhase, setCancelPhase] = useState<
    'idle' | 'confirming' | 'working' | 'withdrawn' | 'error'
  >('idle');
  const [cancelError, setCancelError] = useState<string | null>(null);
  // PF-46 women-only: the required attestation, and the venue/time released to
  // this guest after her RSVP (from create_web_rsvp, or get_web_guest_plan on
  // reload). The share payload never carries them for a women-only plan.
  const [attested, setAttested] = useState(false);
  const [unlocked, setUnlocked] = useState<UnlockedPlan | null>(null);
  // isLate for the withdraw copy, worked out once the start time is known
  // (the server-side prop can't: the share payload has no start_time).
  const [unlockedIsLate, setUnlockedIsLate] = useState<boolean | null>(null);

  // Detect platform on mount (SSR-safe)
  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  // Email links carry ?v=<token>. Verify client-side (link scanners mostly GET
  // without running JS), then drop it so a shared URL doesn't carry it along.
  // ?g= is the guest's web credential (audit C2); it re-links an RSVP stored
  // before 2026-09-27, which only had the short code. Runs before the
  // localStorage effect below, so that effect reads the upgraded record.
  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get('v');
    const guestToken = url.searchParams.get('g');
    if (!token && !guestToken) return;
    if (token) verifyWebRsvpEmail(token).catch(() => {});
    if (guestToken) {
      const existing = getStoredRsvp(shareCode);
      if (existing) storeRsvp(shareCode, { ...existing, guestToken });
    }
    url.searchParams.delete('v');
    url.searchParams.delete('g');
    window.history.replaceState(null, '', url.toString());
  }, [shareCode]);

  // Check localStorage on mount + auto-fill + fetch teaser
  useEffect(() => {
    if (!activity) {
      setRsvpState('pre-rsvp');
      return;
    }

    const userProfile = getStoredUserProfile();
    if (userProfile) {
      setGuestName(userProfile.guestName || '');
      setEmail(userProfile.email || '');
      if (userProfile.phoneNumber) setPhoneNumber(userProfile.phoneNumber);
      if (userProfile.countryCode) setCountryCode(userProfile.countryCode);
      // Phone is the only field behind the disclosure now — expand if saved.
      if (userProfile.phoneNumber) setShowPhone(true);
      // Pre-2026-08-08 profiles have a phone but no email; those can't one-tap,
      // so they fall through to the prefilled form.
      if (userProfile.guestName?.trim() && userProfile.email?.trim()) {
        setHasStoredIdentity(true);
      }
    }

    const existing = getStoredRsvp(shareCode);
    if (existing && activity.redacted && existing.guestToken) {
      // PF-46: a returning guest's women-only plan unlocks from her own token.
      // The skeleton holds until it answers, so the locked tiles never flash.
      getWebGuestPlan(existing.guestToken)
        .then((plan) => {
          if (plan === null) {
            // Withdrawn elsewhere, or removed by the starter: the RSVP is gone.
            removeStoredRsvp(shareCode);
            setError('Your RSVP for this plan is no longer active.');
            setRsvpState('pre-rsvp');
            return;
          }
          if (plan.activity_id === activity.id) {
            setUnlocked(plan);
            setUnlockedIsLate(isLateWithdrawal(plan.start_time));
          }
          setStoredRsvp(existing);
          setRsvpState('post-rsvp');
        })
        .catch(() => {
          // Outage: still her RSVP, the tiles just stay locked.
          setStoredRsvp(existing);
          setRsvpState('post-rsvp');
        });
    } else if (existing) {
      setStoredRsvp(existing);
      setRsvpState('post-rsvp');
    } else {
      setRsvpState('pre-rsvp');
    }

    // Fresh teaser data for both states so participant names + spot count
    // reflect reality (B2 fix: stale snapshot after first-to-RSVP). A redacted
    // plan's teaser is always empty for the web (anon is never eligible), so
    // the crew there comes from the guest's own RSVP response instead.
    if (activity.redacted) return;
    getActivityRsvpTeaser(activity.id).then((data) => {
      if (data) setTeaserData(data);
    });
  }, [activity, shareCode]);

  // Poll teaser every 5s while visible (B4 fix: live "X, Y joining" + spots).
  useEffect(() => {
    if (!activity || activity.redacted) return;
    const id = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return;
      getActivityRsvpTeaser(activity.id).then((data) => {
        if (data) setTeaserData(data);
      });
    }, 5_000);
    return () => clearInterval(id);
  }, [activity]);

  const handleRsvp = useCallback(async () => {
    if (!guestName.trim() || !isValidEmail(email) || !activity) return;
    if (activity.women_only && !attested) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const body: Record<string, string | boolean> = {
        share_code: shareCode,
        guest_name: guestName.trim(),
        email: email.trim(),
      };
      // PF-46: only a women-only plan carries the attestation.
      if (activity.women_only) body.attest_woman = true;
      // Phone is optional — only send it (with its country code) when supplied.
      if (phoneNumber.trim()) {
        body.phone_number = phoneNumber.trim();
        body.country_code = countryCode;
      }

      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, ...getUtmFields() }),
      });

      const data = await res.json();

      if (!res.ok) {
        trackRsvp('web_rsvp_failed', { share_code: shareCode, status: res.status });
        setError(data.error || 'Something went wrong');
        return;
      }
      trackRsvp('web_rsvp_submitted', { share_code: shareCode, has_phone: !!phoneNumber.trim() });

      const rsvpData: StoredRsvp = {
        claimToken: data.claim_token,
        guestToken: data.guest_token,
        guestName: data.guest_name,
        rsvpAt: new Date().toISOString(),
        participantCount: data.participant_count,
        participantNames: cleanParticipantNames(data.participant_names),
        messageCount: data.message_count || 0,
      };
      storeRsvp(shareCode, rsvpData);
      setStoredRsvp(rsvpData);
      // PF-46, the D5 unlock: venue and time arrive with the RSVP itself.
      if (data.activity) {
        setUnlocked(data.activity);
        setUnlockedIsLate(isLateWithdrawal(data.activity.start_time));
      }

      storeUserProfile({
        guestName: guestName.trim(),
        email: email.trim(),
        ...(phoneNumber.trim() ? { phoneNumber: phoneNumber.trim(), countryCode } : {}),
      });
      setHasStoredIdentity(true);
      setEditing(false);

      setJustClaimed(true);
      setRsvpState('post-rsvp');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [guestName, email, phoneNumber, countryCode, activity, shareCode, attested]);

  const copyClaimCode = useCallback(async () => {
    if (!storedRsvp) return;
    // copyText carries the execCommand fallback for the in-app browsers
    // (WhatsApp, Instagram) where these links mostly open — the bare
    // Clipboard API silently no-ops or rejects there.
    const ok = await copyText(storedRsvp.claimToken);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [storedRsvp]);

  const handleCancelRsvp = useCallback(async () => {
    if (!storedRsvp) return;
    if (!storedRsvp.guestToken) {
      setCancelError('Use the Cancel link in your RSVP email, or cancel in the Konectr app.');
      setCancelPhase('error');
      return;
    }
    setCancelPhase('working');
    setCancelError(null);
    try {
      const res = await fetch('/api/rsvp/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guest_token: storedRsvp.guestToken }),
      });
      const data = await res.json();

      if (data?.outcome === 'withdrawn' || data?.outcome === 'already_withdrawn') {
        removeStoredRsvp(shareCode);
        setCancelPhase('withdrawn');
        if (activity && !activity.redacted) getActivityRsvpTeaser(activity.id).then((d) => d && setTeaserData(d));
      } else {
        setCancelError((data && data.error) || 'Something went wrong. Please try again.');
        setCancelPhase('error');
      }
    } catch {
      setCancelError('Network error. Please try again.');
      setCancelPhase('error');
    }
  }, [storedRsvp, shareCode, activity]);

  // =============================================
  // Not Found State
  // =============================================
  if (!activity) {
    return (
      <SimpleStateLayout
        emoji="🔍"
        title="Activity not found"
        subtitle={
          upcomingPlans.length > 0
            ? 'This link may have expired. Here’s what’s on this week instead.'
            : 'This link may have expired or the activity was removed.'
        }
        platform={platform}
        plans={upcomingPlans}
      />
    );
  }

  // A plan that expired or was cancelled before its start time is over too:
  // the DB rejects RSVPs on it ("Activity is not active"), so the page must
  // not keep showing a live roster and an RSVP button (E1D8A507, 2026-09-18).
  const notHappening = isPlanNotHappening(activity.status);
  // A redacted women-only plan has no end_time until the guest's plan unlocks;
  // before that, an ended one arrives as status 'ended'.
  const ended = isPlanOver(activity.status, activity.end_time ?? unlocked?.end_time ?? null);
  const deepLink = `konectr://activity/${shareCode}`;
  // Host row: tap tries the app profile, falls back to the store.
  const creatorLink = activity.user_id ? getSmartProfileLinkProps(activity.user_id) : null;

  // =============================================
  // Ended State
  // =============================================
  if (ended) {
    return (
      <SimpleStateLayout
        emoji={notHappening ? '🚫' : '⏰'}
        title={
          notHappening
            ? 'This plan is no longer happening'
            : upcomingPlans.length > 0
              ? 'This one’s over'
              : 'This activity has ended'
        }
        subtitle={
          upcomingPlans.length > 0
            ? 'Here’s what’s on this week. Grab a spot.'
            : 'Real plans, real people. Get Konectr to see what’s next.'
        }
        platform={platform}
        plans={upcomingPlans}
      />
    );
  }

  // Prefer fresh teaser data; fall back to stored RSVP snapshot.
  // Sanitised: the RPC can emit nulls for members with no display_name, and an
  // older localStorage snapshot may already hold one.
  const participantNames = cleanParticipantNames(
    teaserData?.participant_names || storedRsvp?.participantNames || []
  );
  const participantCount = teaserData?.participant_count
    ?? storedRsvp?.participantCount ?? activity.current_participants ?? 0;
  const spotsRemaining = teaserData?.spots_remaining
    ?? (activity.max_participants > 0 ? activity.max_participants - participantCount : -1);
  const isFull = spotsRemaining <= 0 && activity.max_participants > 0;

  // Email is the required field; a phone, if typed at all, must still look real.
  const canSubmit =
    guestName.trim().length > 0 &&
    isValidEmail(email) &&
    (phoneNumber.trim().length === 0 || phoneNumber.trim().length >= 7) &&
    (!activity.women_only || attested);
  const isReturning = hasStoredIdentity && !editing;
  const emailError =
    emailBlurred && email.trim().length > 0 && !isValidEmail(email)
      ? 'Please enter a valid email'
      : null;

  // ── Redesign props (Kinetic system). Heading auto = venue name (no host role);
  // the "Here for…" purpose lives in details (description is legacy, empty since
  // build 38); hero image keys to the activity. ──
  // PF-46: a redacted women-only plan fills these from the guest's unlocked
  // plan after her RSVP; until then they are null and the screens render locked.
  const locked = activity.redacted && !unlocked;
  const title = activity.title ?? unlocked?.title ?? null;
  const venueName = activity.venue_name ?? unlocked?.venue_name ?? null;
  const startTime = activity.start_time ?? unlocked?.start_time ?? null;
  // The redacted payload's coords are rounded to ~1 km: never a pin.
  const venueLat = activity.redacted ? unlocked?.location_lat ?? null : activity.location_lat;
  const venueLng = activity.redacted ? unlocked?.location_lng ?? null : activity.location_lng;
  const purposeText = activity.details || unlocked?.details || activity.description;
  const vibe = resolveVibe(activity.category);
  const posterPhoto = activityImage({
    vibe: vibe.key,
    venueName,
    title,
    purpose: purposeText,
    category: activity.category,
    tags: activity.tags,
    womenOnly: activity.women_only,
  });
  // Poster heading = activity title, matching the mobile app's activity screen
  // (was venue name in the Kinetic redesign; the two views read as different
  // activities). Venue stays on the WHERE tile + directions via venueShort.
  // Founder pick R4: an untitled women-only plan reads "Women-only <vibe> plan".
  const venueShort = venueName || title || '';
  const heading = title || venueShort || `Women-only ${vibe.name.toLowerCase()} plan`;
  const purpose = purposeText && purposeText !== title ? purposeText : null;
  const timeLabel = startTime ? formatTime(startTime) : '';
  const whenDay = startTime ? `${getRelativeDayPhrase(startTime)} · ${formatShortDate(startTime)}` : '';
  const spotsLeft = isFull || activity.max_participants <= 0 ? 0 : spotsRemaining;
  const lockedTiles = locked ? { dayPart: activity.day_part, area: activity.area } : undefined;

  const handleAddToCalendar = () => {
    if (typeof window === 'undefined') return;
    // PF-46: a women-only plan's .ics is built from the guest's own token.
    const token = activity.women_only ? storedRsvp?.guestToken : undefined;
    window.open(
      token ? `/api/calendar/${shareCode}?token=${encodeURIComponent(token)}` : `/api/calendar/${shareCode}`,
      '_blank'
    );
  };
  const handleShare = async () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: heading, url }); } catch { /* dismissed */ }
    } else {
      // Copy-the-URL fallback (desktop browsers without navigator.share).
      // Deliberately does NOT set `copied`: that state labels the claim-code
      // button, which would flash "Copied!" for a copy of something else.
      await copyText(url);
    }
  };

  // =============================================
  // Active Activity — Kinetic redesign
  // =============================================

  // Loading → poster paints instantly (activity is server-provided); only the
  // RSVP-vs-chatting decision is pending, so we skeleton the body. Prevents a
  // returning RSVP'd user from flashing the claim form before localStorage reads.
  if (rsvpState === 'loading') {
    return (
      <RsvpLayout vibe={vibe} photo={posterPhoto} venueName={heading} womenOnly={activity.women_only}>
        <div className="flex gap-3">
          <div className="flex-1 h-[116px] rounded-[18px] bg-[#F0EEEC] animate-pulse" />
          <div className="flex-1 h-[116px] rounded-[18px] bg-[#F0EEEC] animate-pulse" />
        </div>
        <div className="h-[64px] rounded-[18px] bg-[#F0EEEC] animate-pulse mt-5" />
        <div className="h-[52px] rounded-[13px] bg-[#F0EEEC] animate-pulse mt-6" />
        <div className="h-[52px] rounded-[15px] bg-[#F0EEEC] animate-pulse mt-3" />
      </RsvpLayout>
    );
  }

  // Post-RSVP → chatting (with the withdraw sheet layered above).
  if (rsvpState === 'post-rsvp' && storedRsvp) {
    return (
      <>
        <ChattingScreen
          vibe={vibe}
          photo={posterPhoto}
          heading={heading}
          venueName={venueShort}
          purpose={purpose}
          timeLabel={timeLabel}
          dayLabel={whenDay}
          venueShort={venueShort}
          venueLat={venueLat}
          venueLng={venueLng}
          womenOnly={activity.women_only}
          locked={lockedTiles}
          guestName={storedRsvp.guestName}
          justClaimed={justClaimed}
          crewNames={participantNames}
          crewTotal={participantCount}
          creatorName={activity.creator_name}
          creatorPhotoUrl={activity.creator_photo_url}
          creatorLinkHref={creatorLink?.href}
          onCreatorLinkClick={creatorLink?.onClick}
          onAddToCalendar={handleAddToCalendar}
          onShare={handleShare}
          onWithdraw={() => setCancelPhase('confirming')}
          chat={
            <>
              {/* PF-42: the "still in?" card, pinned above the chat while open. */}
              {storedRsvp.guestToken ? (
                <>
                  <WebHeadcountCard
                    guestToken={storedRsvp.guestToken}
                    onOut={() => setCancelPhase('confirming')}
                  />
                  <WebChatPanel guestToken={storedRsvp.guestToken} guestName={storedRsvp.guestName} />
                </>
              ) : (
                <p className="text-[12.5px] text-[#8A6A5A] text-center py-4">
                  Open the link in your latest RSVP email to see the group chat.
                </p>
              )}
            </>
          }
          belowChat={
            <div className="mt-5 space-y-4">
              <div className="bg-[#FFF4F1] border border-[#F3E4DD] rounded-[16px] p-4 text-center">
                <p className="text-[12.5px] text-[#8A6A5A] font-medium mb-3 leading-relaxed">
                  Get reminded, see who&apos;s coming, and keep chatting in the app
                </p>
                <StoreCTAs platform={platform} />
                {platform !== 'android' && <OpenInApp deepLink={deepLink} />}
              </div>
              {/* Claim code — quiet fallback */}
              <div className="text-center">
                <p className="text-[10px] text-[#BBB] mb-1">Having trouble? Use your claim code</p>
                <button
                  onClick={copyClaimCode}
                  className="text-[12px] font-mono text-[#999] hover:text-[#FF774D] transition-colors"
                >
                  {copied ? 'Copied!' : storedRsvp.claimToken}
                </button>
              </div>
            </div>
          }
        />
        {cancelPhase !== 'idle' && (
          <WithdrawSheet
            phase={cancelPhase}
            isLate={unlockedIsLate ?? isLate}
            venueShort={venueShort || 'this plan'}
            errorMessage={cancelError}
            onConfirm={handleCancelRsvp}
            onRetry={handleCancelRsvp}
            onDismiss={() => setCancelPhase('idle')}
            onDone={() => {
              removeStoredRsvp(shareCode);
              setStoredRsvp(null);
              setUnlocked(null);
              setUnlockedIsLate(null);
              setAttested(false);
              setCancelPhase('idle');
              setRsvpState('pre-rsvp');
            }}
          />
        )}
      </>
    );
  }

  // Pre-RSVP → claim (loading shows the same shell; inputs are simply empty).
  return (
    <ClaimScreen
      vibe={vibe}
      photo={posterPhoto}
      heading={heading}
      venueName={venueShort}
      purpose={purpose}
      timeLabel={timeLabel}
      dayLabel={whenDay}
      venueShort={venueShort}
      venueLat={venueLat}
      venueLng={venueLng}
      womenOnly={activity.women_only}
      locked={lockedTiles && { ...lockedTiles, groupSize: activity.max_participants }}
      crewNames={participantNames}
      crewTotal={participantCount}
      spotsLeft={spotsLeft}
      creatorName={activity.creator_name}
      creatorPhotoUrl={activity.creator_photo_url}
      creatorLinkHref={creatorLink?.href}
      onCreatorLinkClick={creatorLink?.onClick}
      isFull={isFull}
      openInAppHref={platform !== 'android' ? deepLink : undefined}
      fullSlot={
        <div className="text-center">
          <p className="text-[14px] text-[#616161] mb-3">This one&apos;s full — grab another that fits.</p>
          <StoreCTAs platform={platform} variant="compact" />
        </div>
      }
      appCta={<StoreCTAs platform={platform} />}
      form={{
        name: guestName,
        onName: setGuestName,
        countryCode,
        onCountryCode: setCountryCode,
        countryCodes,
        phone: phoneNumber,
        onPhone: setPhoneNumber,
        showPhone,
        onShowPhone: () => setShowPhone(true),
        email,
        onEmail: setEmail,
        onEmailBlur: () => setEmailBlurred(true),
        emailError,
        isReturning,
        onEdit: () => setEditing(true),
        canSubmit,
        isSubmitting,
        error,
        onSubmit: handleRsvp,
        attest: activity.women_only ? { checked: attested, onChange: setAttested } : undefined,
      }}
    />
  );

}
