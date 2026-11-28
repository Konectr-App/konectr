// © Konectr 2026. All rights reserved.
// Proprietary and confidential.
'use client';

import { useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import type { Vibe } from './vibes';
import { KonectrLogo, VibeChip, WomenOnlyGlyph } from './KineticUI';
import CoverLightbox from './CoverLightbox';

// One unified shell for every RSVP state (claim · chatting · withdraw), across
// mobile and desktop. Mobile (<lg): full-bleed photo hero on top, content sheet
// lifts over it. Desktop (≥lg): the photo becomes a sticky left rail, content
// scrolls on the right — same components, no separate desktop codebase.
export interface RsvpLayoutProps {
  vibe: Vibe;
  photo: string;
  venueName: string;
  /** Optional status word over the poster, e.g. "You're in" on the chatting state. */
  posterKicker?: string;
  /** PF-46: "Women only" line over the vibe chip. */
  womenOnly?: boolean;
  /** Tapping the poster opens the whole image full screen (#825). */
  viewer?: PosterViewer;
  children: ReactNode;
}

export interface PosterViewer {
  /** The Captain's own cover is shown, not a default photo: adds the expand hint. */
  customCover: boolean;
  /** CSS object-position for the hero crop (the cover's focal point). The lightbox ignores it. */
  objectPosition?: string;
  /** Fired each time the lightbox opens. */
  onOpen?: () => void;
  /** The page's share action: shares the plan link. */
  onShare: () => void;
}

const HERO_GRADIENT =
  'linear-gradient(180deg,rgba(12,10,8,.34) 0%,rgba(12,10,8,.02) 30%,rgba(12,10,8,.32) 62%,rgba(10,9,7,.84) 100%)';
const HERO_GRADIENT_DESKTOP =
  'linear-gradient(180deg,rgba(12,10,8,.30) 0%,rgba(12,10,8,0) 34%,rgba(10,9,7,.50) 78%,rgba(10,9,7,.90) 100%)';

export default function RsvpLayout({ vibe, photo, venueName, posterKicker, womenOnly, viewer, children }: RsvpLayoutProps) {
  const [viewing, setViewing] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const hint = viewer?.customCover ?? false;

  const openViewer = () => {
    setViewing(true);
    viewer?.onOpen?.();
  };
  const closeViewer = () => {
    setViewing(false);
    triggerRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] lg:min-h-screen">
      {/* ── Poster ─────────────────────────────────────────────── */}
      {/* Mobile: stacked hero. Desktop: sticky full-height left rail. */}
      <div className="relative h-[384px] overflow-hidden lg:h-screen lg:sticky lg:top-0">
        {/* LCP element — optimized + priority so the share link paints fast. */}
        <Image
          src={photo}
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) calc(100vw - 560px), 100vw"
          className="object-cover"
          style={viewer?.objectPosition ? { objectPosition: viewer.objectPosition } : undefined}
        />
        <div className="absolute inset-0 lg:hidden" style={{ background: HERO_GRADIENT }} />
        <div className="absolute inset-0 hidden lg:block" style={{ background: HERO_GRADIENT_DESKTOP }} />

        {/* The whole poster is the tap target; the text layers above let taps through. */}
        {viewer && (
          <button
            ref={triggerRef}
            type="button"
            aria-label="Plan cover, opens full screen"
            onClick={openViewer}
            className="absolute inset-0 z-[1] cursor-zoom-in focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-[#FFC845]"
          />
        )}

        {/* Top bar — brand + tagline */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 flex items-center justify-between px-[18px] pt-4 z-[2] lg:px-9 lg:pt-8">
          <span className="flex items-center gap-[9px]">
            <KonectrLogo variant="white" size={27} />
            <b className="font-[family-name:var(--font-heading)] font-bold text-[16px] text-white -tracking-[0.02em] lg:text-[18px]">
              Konectr
            </b>
          </span>
          <span className="text-[11px] italic text-white/90 font-medium lg:text-[13px]">
            Your plan. New people. Nearby.
          </span>
        </div>

        {/* Bottom — vibe + venue title */}
        <div
          className={`pointer-events-none absolute left-0 right-0 bottom-0 px-[18px] pb-[22px] z-[2] text-white lg:px-9 lg:pb-11 lg:max-w-[560px] ${
            hint ? 'pr-[60px] lg:pr-[72px]' : ''
          }`}
        >
          {posterKicker && (
            <div className="mb-[11px] flex w-fit items-center gap-[7px] text-[12.5px] font-[family-name:var(--font-heading)] font-extrabold text-[#FFC845] lg:text-[14px]">
              <span className="w-[7px] h-[7px] rounded-full bg-[#FFC845] shadow-[0_0_10px_2px_rgba(255,200,69,0.6)]" />
              {posterKicker}
            </div>
          )}
          {womenOnly && (
            <div className="mb-[11px] flex w-fit items-center gap-[7px] text-[12.5px] font-[family-name:var(--font-heading)] font-extrabold text-white lg:text-[14px]">
              <WomenOnlyGlyph className="w-[15px] h-[15px] text-[#FFC845]" />
              Women only
            </div>
          )}
          <VibeChip vibe={vibe} />
          <h1 className="font-[family-name:var(--font-heading)] font-black text-[33px] leading-[0.99] -tracking-[0.03em] mt-[13px] [text-shadow:0_2px_24px_rgba(0,0,0,0.42)] text-balance lg:text-[46px] lg:mt-4">
            {venueName}
          </h1>
        </div>

        {/* Expand hint — only on a Captain's cover, which is often a poster
            the crop cuts off. Mobile sits above the sheet's 20px overlap. */}
        {hint && (
          <span
            aria-hidden="true"
            data-cover-hint=""
            className="pointer-events-none absolute right-[14px] bottom-[38px] z-[2] w-8 h-8 grid place-items-center rounded-full bg-black/45 text-white lg:right-7 lg:bottom-11"
          >
            <svg className="w-[15px] h-[15px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 3 21 3 21 9" />
              <polyline points="9 21 3 21 3 15" />
              <line x1="21" y1="3" x2="14" y2="10" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
          </span>
        )}
      </div>

      {/* ── Content ────────────────────────────────────────────── */}
      {/* Mobile: sheet lifts over the hero. Desktop: plain right column. */}
      <div className="relative z-[3] -mt-5 bg-[#FAFAFA] rounded-t-[26px] px-[18px] pt-[22px] pb-8 lg:mt-0 lg:rounded-none lg:px-10 lg:pt-11 lg:pb-14 lg:max-w-[560px] lg:w-full lg:mx-auto lg:min-h-screen lg:flex lg:flex-col lg:justify-center">
        <div className="lg:w-full">{children}</div>
      </div>

      {/* Outside the poster: its sticky rail is a stacking context the content
          column (z-3) would paint over. */}
      {viewer && viewing && <CoverLightbox src={photo} onShare={viewer.onShare} onClose={closeViewer} />}
    </div>
  );
}
