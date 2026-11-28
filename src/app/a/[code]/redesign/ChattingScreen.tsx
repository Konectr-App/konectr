// © Konectr 2026. All rights reserved.
// Proprietary and confidential.
'use client';

import type { MouseEvent, ReactNode } from 'react';
import type { Vibe } from './vibes';
import RsvpLayout, { type PosterViewer } from './RsvpLayout';
import { WhenWhereTiles, HereFor, CrewStack, StartedByRow, LockedWhenWhereTiles, PaidTag, PlanLinks } from './KineticUI';
import type { PlanLink } from '@/lib/planExtras';

export interface ChattingScreenProps {
  vibe: Vibe;
  photo: string;
  heading?: string;   // poster h1 (activity title); falls back to venueName
  venueName: string;  // real venue name — WHERE tile + maps directions query
  purpose: string | null;
  timeLabel: string;
  dayLabel: string;
  venueShort: string;
  areaLabel?: string | null;
  /** Coords for the maps-directions chooser on the WHERE tile (venueName reused as the label). */
  venueLat?: number | null;
  venueLng?: number | null;
  guestName: string;
  /** True only right after submitting the claim — gates the one-time celebration line. */
  justClaimed?: boolean;
  crewNames: string[];
  crewTotal: number;
  /** Who created the activity — name + optional avatar; tap opens their app profile. */
  creatorName?: string | null;
  creatorPhotoUrl?: string | null;
  creatorLinkHref?: string;
  onCreatorLinkClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  /** Live chat surface (WebChatPanel) — falls back to a preview card when absent. */
  chat?: ReactNode;
  /** Rendered under the chat — platform/beta CTA, open-in-app, claim code. */
  belowChat?: ReactNode;
  /** Opens the withdraw flow. */
  onWithdraw?: () => void;
  onAddToCalendar?: () => void;
  onShare?: () => void;
  /** The Captain's Paid tag ("Paid · RM 25 at the gym"); null on a free plan. */
  paidTag?: string | null;
  /** The Captain's links, already checked by planLinks(). */
  links?: PlanLink[];
  /** PF-46: women-only plan (poster line). */
  womenOnly?: boolean;
  /** Tapping the poster opens the whole image full screen (#825). */
  viewer?: PosterViewer;
  /** PF-46: the guest's plan couldn't be unlocked yet — keep the tiles locked. */
  locked?: { dayPart: string | null; area: string | null };
}

// State 2 — confirmed & chatting. Same shell as claim; the poster now reads
// "You're in", the form is replaced by the group chat, and a quiet withdraw
// affordance sits at the bottom (no host to "cancel on" — you withdraw yourself).
export default function ChattingScreen(p: ChattingScreenProps) {
  return (
    <RsvpLayout vibe={p.vibe} photo={p.photo} venueName={p.heading || p.venueName} posterKicker="You're in" womenOnly={p.womenOnly} viewer={p.viewer}>
      {/* Confirmation line — one-time celebration, only right after claiming.
          Returning visitors land straight on the tiles (the poster already says "You're in"). */}
      {p.justClaimed && (
        <div className="flex items-start gap-3 mb-5">
          <span className="shrink-0 w-10 h-10 rounded-full bg-[#1FA463] grid place-items-center shadow-[0_10px_24px_-10px_rgba(31,164,99,0.6)]">
            <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 12 10 18 20 6" />
            </svg>
          </span>
          <div>
            <div className="font-[family-name:var(--font-heading)] font-black text-[19px] -tracking-[0.02em] leading-tight">
              Nice, {p.guestName}. Your spot&apos;s locked.
            </div>
            <div className="text-[13.5px] text-[#616161] mt-[3px]">
              We&apos;ll nudge you before it starts. Say hi to the crew below 👇
            </div>
          </div>
        </div>
      )}

      <div>
        {p.locked ? (
          <LockedWhenWhereTiles dayPart={p.locked.dayPart} area={p.locked.area} />
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
        {/* venueName above is the real venue (maps query); the poster h1 uses heading. */}
      </div>

      {p.paidTag && (
        <div className="mt-3">
          <PaidTag label={p.paidTag} />
        </div>
      )}

      {/* Calendar + share — icon-only (labels omitted by design; discoverable) */}
      <div className="flex gap-[9px] mt-3">
        <button
          onClick={p.onAddToCalendar}
          aria-label="Add to calendar"
          title="Add to calendar"
          className="w-11 h-11 flex items-center justify-center bg-white border-[1.5px] border-[#E0E0E0] rounded-[13px] text-[#1F1F1F] active:scale-[0.95] transition-transform hover:border-[#F3C6B6]"
        >
          <svg className="w-[20px] h-[20px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="3" y1="10" x2="21" y2="10" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="16" y1="2" x2="16" y2="6" />
          </svg>
        </button>
        <button
          onClick={p.onShare}
          aria-label="Share"
          title="Share"
          className="w-11 h-11 flex items-center justify-center bg-white border-[1.5px] border-[#E0E0E0] rounded-[13px] text-[#1F1F1F] active:scale-[0.95] transition-transform hover:border-[#F3C6B6]"
        >
          <svg className="w-[19px] h-[19px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
        </button>
      </div>

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
        <CrewStack names={p.crewNames} total={p.crewTotal} spotsLeft={0} />
      </div>

      {/* Chat */}
      <div className="mt-5">
        {p.chat ?? <ChatPreview guestName={p.guestName} crewNames={p.crewNames} />}
      </div>

      {p.belowChat}

      {/* Withdraw affordance — quiet, non-destructive framing */}
      <div className="mt-6 text-center">
        <button
          onClick={p.onWithdraw}
          className="text-[13px] text-[#6B6B6B] font-semibold underline decoration-[#CFCBC7] underline-offset-4 hover:text-[#1F1F1F] transition-colors"
        >
          Can&apos;t make it anymore?
        </button>
      </div>
    </RsvpLayout>
  );
}

// ── Preview-only chat card (Kinetic-styled) ─────────────────────────────────
// Mirrors WebChatPanel's shape so the live panel drops in cleanly, but dressed
// in the redesign's language for review. Real page passes `chat={<WebChatPanel/>}`.
function ChatPreview({ guestName, crewNames }: { guestName: string; crewNames: string[] }) {
  const other = crewNames[0] ?? 'Julia';
  return (
    <div className="bg-white rounded-[18px] border border-[#F0EEEC] overflow-hidden shadow-[0_12px_30px_-20px_rgba(31,31,31,0.28)]">
      <div className="bg-[#FFF4F1] px-4 py-3 border-b border-[#F3E4DD] flex items-center justify-between">
        <span className="flex items-center gap-2 font-[family-name:var(--font-heading)] font-extrabold text-[13px] text-[#E6693F]">
          💬 Activity Chatter
        </span>
        <span className="text-[11px] text-[#B48A79] font-semibold">10 messages</span>
      </div>
      <div className="px-3 py-3 bg-[#FAFAFA] space-y-2">
        <Bubble self={false} name={other} web>
          Anyone bringing a spare racket? 🎾
        </Bubble>
        <Bubble self name={guestName}>
          I&apos;ve got two — happy to share!
        </Bubble>
        <Bubble self={false} name={other} web>
          Legend. See you all Sunday ☀️
        </Bubble>
      </div>
      <div className="border-t border-[#F0F0F0] p-2 flex gap-2">
        <input
          disabled
          placeholder="Write a message…"
          className="flex-1 px-3 py-[10px] rounded-[11px] border border-[#E5E5E5] text-[14px] text-[#1F1F1F] placeholder:text-[#B5B0AB] bg-white"
        />
        <button className="px-4 rounded-[11px] bg-[#FF774D] text-[#1F1F1F] text-[14px] font-bold">Send</button>
      </div>
    </div>
  );
}

function Bubble({ self, name, web, children }: { self: boolean; name: string; web?: boolean; children: ReactNode }) {
  return (
    <div className={`flex ${self ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[78%] px-[13px] py-2 rounded-[14px] ${self ? 'bg-[#FF774D] text-[#1F1F1F]' : 'bg-white border border-[#F0F0F0] text-[#1F1F1F]'}`}>
        {!self && (
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[10.5px] font-bold text-[#FF774D]">{name}</span>
            {web && <span className="text-[8px] font-semibold uppercase tracking-wider text-[#FF774D] bg-[#FFE5D6] px-1 py-0.5 rounded">via web</span>}
          </div>
        )}
        <div className="text-[14px] leading-snug">{children}</div>
      </div>
    </div>
  );
}
