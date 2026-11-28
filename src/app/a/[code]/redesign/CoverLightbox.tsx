// © Konectr 2026. All rights reserved.
// Proprietary and confidential.
'use client';

import { useEffect, useRef } from 'react';

// The whole plan cover, full screen (Konectr-App/konectr-mvp#825). The hero
// crops a Captain's poster to fill its box; this fits all of it on black.
// Same dialog contract as MapsSheet and WithdrawSheet: body scroll locked,
// Escape closes, focus trapped inside while open. RsvpLayout gives focus back
// to the hero on close (Safari never focuses a tapped button, so the
// "focus whatever was active" trick in MapsSheet would drop it to <body>).
// The image is the original public URL in a plain <img>: the hero's
// next/image size is too small to read a poster's text. Share and Close only,
// no save or download.

export interface CoverLightboxProps {
  src: string;
  /** The page's own share action (the plan link, not the image). */
  onShare: () => void;
  onClose: () => void;
}

export default function CoverLightbox({ src, onShare, onClose }: CoverLightboxProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  // Latest onClose without re-running the mount-once effect (the page
  // re-renders on every 5s teaser poll).
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; });

  useEffect(() => {
    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    // Hiding a classic scrollbar widens the page under the overlay; pad it
    // back so nothing shifts on open.
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbar > 0) {
      body.style.paddingRight = `${parseFloat(getComputedStyle(body).paddingRight) + scrollbar}px`;
    }
    body.style.overflow = 'hidden';

    const box = boxRef.current;
    const focusables = () =>
      Array.from(
        box?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input, [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeRef.current();
        return;
      }
      if (e.key !== 'Tab') return;
      const els = focusables();
      if (els.length === 0) return;
      const first = els[0];
      const last = els[els.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (active === first || !box?.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !box?.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
    };
  }, []);

  return (
    <div
      ref={boxRef}
      role="dialog"
      aria-modal="true"
      aria-label="Plan cover"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black"
    >
      {/* Top and bottom bands keep the buttons off the picture. */}
      <div className="absolute inset-0 flex items-center justify-center px-3 pt-[68px] pb-[84px]">
        {/* eslint-disable-next-line @next/next/no-img-element -- the original, uncropped cover at full size; next/image would serve the hero's resized copy */}
        <img
          src={src}
          alt="Plan cover"
          decoding="async"
          onClick={(e) => e.stopPropagation()}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      <button
        type="button"
        aria-label="Close"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute right-3 top-[max(12px,env(safe-area-inset-top))] w-11 h-11 grid place-items-center rounded-full bg-white/15 text-white hover:bg-white/25 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC845]"
      >
        <svg className="w-[20px] h-[20px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="18" y1="6" x2="6" y2="18" />
        </svg>
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onShare();
        }}
        className="absolute left-1/2 -translate-x-1/2 bottom-[max(20px,env(safe-area-inset-bottom))] h-11 px-5 flex items-center gap-2 rounded-full bg-[#FF774D] text-[#1F1F1F] font-[family-name:var(--font-heading)] font-black text-[15px] hover:bg-[#E6693F] active:scale-[0.98] transition-[background-color,transform] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC845] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      >
        <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
        Share
      </button>
    </div>
  );
}
