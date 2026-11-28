// © Konectr 2026. All rights reserved.
// Proprietary and confidential.
'use client';

import type { MouseEvent, ReactNode } from 'react';
import type { Vibe } from './vibes';
import RsvpLayout, { type PosterViewer } from './RsvpLayout';
import {
  WhenWhereTiles, HereFor, CrewStack, TrustLine, StartedByRow,
  LockedWhenWhereTiles, WomenOnlyBanner, LockedCrewRow, AttestCheckbox, PaidTag, PlanLinks,
} from './KineticUI';
import type { PlanLink } from '@/lib/planExtras';

export interface CountryCode {
  code: string;
  name: string;
  flag: string;
}

// Controlled claim form — the page owns all state; this only renders + calls back.
export interface ClaimForm {
  name: string;
  onName: (v: string) => void;
  countryCode: string;
  onCountryCode: (v: string) => void;
  countryCodes: CountryCode[];
  /** Phone is optional (2026-08-08) — collapsed behind a disclosure. */
  phone: string;
  onPhone: (v: string) => void;
  showPhone: boolean;
  onShowPhone: () => void;
  /** Email is the required identity field + dedupe key. */
  email: string;
  onEmail: (v: string) => void;
  onEmailBlur: () => void;
  emailError?: string | null;
  /** Known guest (name + email on this device) → one-tap chip instead of inputs. */
  isReturning: boolean;
  onEdit: () => void;
  canSubmit: boolean;
  isSubmitting: boolean;
  error?: string | null;
  onSubmit: () => void;
  /** PF-46: the required "I'm a woman" attestation, only on a women-only plan. */
  attest?: { checked: boolean; onChange: (v: boolean) => void };
}

/** What a redacted women-only plan shows before the RSVP (PF-46, D5). */
export interface LockedDetails {
  dayPart: string | null;
  area: string | null;
  groupSize: number;
}

export interface ClaimScreenProps {
  vibe: Vibe;
  photo: string;
  heading?: string;       // poster h1 (activity title); falls back to venueName
  venueName: string;      // real venue name — WHERE tile + maps directions query
  purpose: string | null; // the "Here for…" description
  timeLabel: string;
  dayLabel: string;
  venueShort: string;
  areaLabel?: string | null;
  /** Coords for the maps-directions chooser on the WHERE tile (venueName reused as the label). */
  venueLat?: number | null;
  venueLng?: number | null;
  crewNames: string[];
  crewTotal: number;
  spotsLeft: number;
  /** Who created the activity — name + optional avatar; tap opens their app profile. */
  creatorName?: string | null;
  creatorPhotoUrl?: string | null;
  creatorLinkHref?: string;
  onCreatorLinkClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  form: ClaimForm;
  /** When full: replaces the form (e.g. "this one's full" + beta CTA). */
  isFull?: boolean;
  fullSlot?: ReactNode;
  /** Store CTA, rendered above the form; the web RSVP is the fallback below it. */
  appCta?: ReactNode;
  /** Deep-link for existing app users; hidden when absent. */
  openInAppHref?: string;
  /** The Captain's Paid tag ("Paid · RM 25 at the gym"); null on a free plan. */
  paidTag?: string | null;
  /** The Captain's links, already checked by planLinks(). */
  links?: PlanLink[];
  /** PF-46: women-only plan (poster line). */
  womenOnly?: boolean;
  /** Tapping the poster opens the whole image full screen (#825). */
  viewer?: PosterViewer;
  /** PF-46: venue, time and crew are hidden; show day part, area and group size. */
  locked?: LockedDetails;
}

// State 1 — claim a spot. Poster + responsive split handled by RsvpLayout.
export default function ClaimScreen(p: ClaimScreenProps) {
  const f = p.form;
  const submitOnEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && f.canSubmit && !f.isSubmitting) f.onSubmit();
  };

  return (
    <RsvpLayout vibe={p.vibe} photo={p.photo} venueName={p.heading || p.venueName} womenOnly={p.womenOnly} viewer={p.viewer}>
      {p.locked ? (
        <>
          <LockedWhenWhereTiles dayPart={p.locked.dayPart} area={p.locked.area} />
          <div className="mt-3">
            <WomenOnlyBanner />
          </div>
        </>
      ) : (
        <WhenWhereTiles
          timeLabel={p.timeLabel}
          dayLabel={p.dayLabel}
          venueShort={p.venueShort}
          areaLabel={p.areaLabel}
          venueName={p.venueName}
          venueLat={p.venueLat}
          venueLng={p.venueLng}
        />
      )}

      {p.paidTag && (
        <div className="mt-3">
          <PaidTag label={p.paidTag} />
        </div>
      )}

      {p.purpose && (
        <div className="mt-5">
          <HereFor text={p.purpose} />
        </div>
      )}

      {p.links && p.links.length > 0 && (
        <div className="mt-4">
          <PlanLinks links={p.links} />
        </div>
      )}

      {p.creatorName && (
        <div className="mt-4">
          <StartedByRow
            name={p.creatorName}
            photoUrl={p.creatorPhotoUrl}
            href={p.creatorLinkHref}
            onClick={p.onCreatorLinkClick}
          />
        </div>
      )}

      <div className="mt-5">
        {p.locked ? (
          <LockedCrewRow groupSize={p.locked.groupSize} />
        ) : (
          <CrewStack names={p.crewNames} total={p.crewTotal} spotsLeft={p.spotsLeft} />
        )}
      </div>

      {p.isFull ? (
        <div className="mt-6">{p.fullSlot}</div>
      ) : (
        <>
          {p.appCta && (
            <>
              <div className="mt-6">{p.appCta}</div>

              {p.openInAppHref && (
                <div className="text-center mt-[15px] text-[12.5px]">
                  <a className="inline-flex min-h-11 items-center text-[#C2410C] font-bold" href={p.openInAppHref}>Already on Konectr? Open in the app ↗</a>
                </div>
              )}

              <div className="flex items-center gap-2 mt-6">
                <div className="flex-1 h-px bg-[#EDEBE9]" />
                <span className="text-[10px] uppercase tracking-wider text-[#B5B0AB]">No app? RSVP on web</span>
                <div className="flex-1 h-px bg-[#EDEBE9]" />
              </div>
            </>
          )}

          <div className="font-[family-name:var(--font-heading)] font-black text-[20px] -tracking-[0.02em] mt-6">
            Grab a spot <span className="text-[#FF774D]">&amp;</span> you&apos;re matched.
          </div>

          {f.isReturning ? (
            /* Returning guest — name + email already on this device, so no typing. */
            <div className="mt-3 flex items-center gap-3 border-[1.5px] border-[#EDEBE9] bg-[#FAFAFA] rounded-[14px] px-[14px] py-[13px]">
              <div
                aria-hidden="true"
                className="w-10 h-10 shrink-0 grid place-items-center rounded-full bg-[#FFF4F1] border-[1.5px] border-[#F3E4DD] text-[#FF774D] font-black text-[15px]"
              >
                {((f.name ?? '').trim().charAt(0) || '?').toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[15px] font-bold text-[#1F1F1F] -tracking-[0.01em] truncate">{f.name}</div>
                <div className="text-[12.5px] text-[#737373] truncate">{f.email}</div>
              </div>
              <button
                type="button"
                onClick={f.onEdit}
                className="shrink-0 text-[12.5px] font-bold text-[#FF774D] hover:opacity-70 transition-opacity"
              >
                Edit →
              </button>
            </div>
          ) : (
            <>
              <input
                value={f.name}
                onChange={(e) => f.onName(e.target.value)}
                onKeyDown={submitOnEnter}
                maxLength={50}
                autoComplete="given-name"
                aria-label="Your first name"
                className="w-full border-[1.5px] border-[#E0E0E0] bg-white rounded-[13px] px-4 py-[15px] text-[15px] text-[#1F1F1F] mt-[11px] placeholder:text-[#737373] focus:outline-none focus:border-[#FF774D]"
                placeholder="Your first name"
              />

              <input
                value={f.email}
                onChange={(e) => f.onEmail(e.target.value)}
                onBlur={f.onEmailBlur}
                onKeyDown={submitOnEnter}
                type="email"
                inputMode="email"
                autoComplete="email"
                maxLength={254}
                required
                aria-required="true"
                aria-label="Email — where your reminder goes"
                aria-invalid={f.emailError ? true : undefined}
                className={`w-full border-[1.5px] bg-white rounded-[13px] px-4 py-[15px] text-[15px] text-[#1F1F1F] mt-[9px] placeholder:text-[#737373] focus:outline-none ${
                  f.emailError ? 'border-[#D64545]' : 'border-[#E0E0E0] focus:border-[#FF774D]'
                }`}
                placeholder="Email — where your reminder goes"
              />
              {f.emailError && <p className="text-[12.5px] text-[#D64545] mt-[7px]">{f.emailError}</p>}

              {/* Optional phone disclosure */}
              {!f.showPhone ? (
                <button
                  type="button"
                  onClick={f.onShowPhone}
                  className="mt-[2px] min-h-11 inline-flex items-center gap-1.5 text-[12.5px] text-[#6E6E6E] hover:text-[#FF774D] transition-colors"
                >
                  <span className="text-[#8A8580]">+</span> Add phone <span className="text-[#8A8580]">(optional)</span>
                </button>
              ) : (
                <div className="flex gap-[9px] mt-[9px]">
                  <div className="relative shrink-0">
                    <select
                      value={f.countryCode}
                      onChange={(e) => f.onCountryCode(e.target.value)}
                      aria-label="Country code"
                      className="h-full appearance-none border-[1.5px] border-[#E0E0E0] bg-white rounded-[13px] pl-[13px] pr-7 text-[14px] font-semibold text-[#1F1F1F] focus:outline-none focus:border-[#FF774D]"
                    >
                      {f.countryCodes.map((cc) => (
                        <option key={cc.code} value={cc.code}>{cc.flag} {cc.code}</option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-[9px] top-1/2 -translate-y-1/2 text-[#B5B0AB] text-[11px]">▾</span>
                  </div>
                  <input
                    value={f.phone}
                    onChange={(e) => f.onPhone(e.target.value)}
                    onKeyDown={submitOnEnter}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel-national"
                    aria-label="Phone number (optional)"
                    className="flex-1 min-w-0 border-[1.5px] border-[#E0E0E0] bg-white rounded-[13px] px-4 py-[15px] text-[15px] text-[#1F1F1F] placeholder:text-[#737373] focus:outline-none focus:border-[#FF774D]"
                    placeholder="Phone number (optional)"
                  />
                </div>
              )}
            </>
          )}

          {f.attest && <AttestCheckbox checked={f.attest.checked} onChange={f.attest.onChange} />}

          <TrustLine />

          <button
            onClick={f.onSubmit}
            disabled={!f.canSubmit || f.isSubmitting}
            className="w-full mt-4 rounded-[15px] py-[17px] font-[family-name:var(--font-heading)] font-black text-[17px] text-[#1F1F1F] bg-[#FF774D] hover:bg-[#E6693F] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 transition-all shadow-[0_18px_40px_-12px_rgba(255,119,77,0.38)]"
          >
            {f.isSubmitting ? (
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin align-middle" />
            ) : (
              "I'm in →"
            )}
          </button>

          {f.error && <p className="text-[12.5px] text-red-500 mt-2 text-center">{f.error}</p>}

        </>
      )}
    </RsvpLayout>
  );
}
