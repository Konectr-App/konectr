// © Konectr 2026. All rights reserved.
// Proprietary and confidential.
'use client';

import { useState, useEffect, useRef, type MouseEvent, type ReactNode } from 'react';
import type { Vibe } from './vibes';
import type { PlanLink } from '@/lib/planExtras';

// Kinetic Brand Design System v3.0 tokens (lib/core/theme/kinetic_colors.dart):
// Sunset Orange #FF774D · Solar Amber #FFC845 · Graphite #1F1F1F · Cloud White #FAFAFA
// tint #FFF4F1 · hover #E6693F. Colour is constant; the vibe changes image + words.

export function KonectrLogo({ variant = 'white', size = 24 }: { variant?: 'white' | 'orange'; size?: number }) {
  const src = variant === 'white' ? '/logos/konectr-white.svg' : '/logos/konectr-orange.svg';
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Konectr"
      width={size}
      height={size}
      style={variant === 'white' ? { filter: 'drop-shadow(0 1px 3px rgba(0,0,0,.35))' } : undefined}
    />
  );
}

export function VibeChip({ vibe, suffix }: { vibe: Vibe; suffix?: string }) {
  return (
    <span className="inline-flex items-center gap-[7px] bg-[#FFC845] text-[#1F1F1F] font-[family-name:var(--font-heading)] font-extrabold text-[12.5px] pl-[10px] pr-[13px] py-[7px] rounded-full">
      <span className="text-[15px] leading-none">{vibe.emoji}</span>
      {vibe.name}{suffix ? ` · ${suffix}` : ''}
    </span>
  );
}

// The two match dimensions Konectr weights most — made prominent, paired.
// The WHERE tile is tappable when we know the venue/coords: it opens a small
// chooser to navigate in Apple Maps / Google Maps / Waze.
export function WhenWhereTiles({
  timeLabel, dayLabel, venueShort, areaLabel, venueName, venueLat, venueLng,
}: {
  timeLabel: string; dayLabel: string; venueShort: string; areaLabel?: string | null;
  venueName?: string | null; venueLat?: number | null; venueLng?: number | null;
}) {
  const [mapsOpen, setMapsOpen] = useState(false);
  const hasCoords = venueLat != null && venueLng != null;
  const canOpenMaps = hasCoords || !!(venueName && venueName.trim());
  return (
    <>
      <div className="flex gap-3">
        <Tile icon="🗓️" label="WHEN" value={timeLabel} valueClass="text-[#FF774D]" sub={dayLabel} />
        <Tile
          icon="📍"
          label="WHERE"
          value={venueShort}
          sub={areaLabel}
          onClick={canOpenMaps ? () => setMapsOpen(true) : undefined}
          actionHint="Directions"
        />
      </div>
      {mapsOpen && (
        <MapsSheet
          venueName={(venueName && venueName.trim()) || venueShort}
          lat={venueLat ?? null}
          lng={venueLng ?? null}
          onClose={() => setMapsOpen(false)}
        />
      )}
    </>
  );
}

// ── Women-only (PF-46) ──────────────────────────────────────────────────────
// Board: docs/design/women-only/women-only-board-v2.html (mobile repo), picks
// locked at rev 2.1: icon I2 "ponytails", web checkbox W2.

export function WomenOnlyGlyph({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="7.5" cy="8.5" r="2.6" />
      <path d="M5.1 7.3c-1.5-.1-2.4.9-2.4 2.3 0 .9.4 1.7 1.1 2.1M3 20.5V20a4.5 4.5 0 0 1 9 0v.5" />
      <circle cx="16.5" cy="8.5" r="2.6" />
      <path d="M18.9 7.3c1.5-.1 2.4.9 2.4 2.3 0 .9-.4 1.7-1.1 2.1M12 20.5V20a4.5 4.5 0 0 1 9 0v.5" />
    </svg>
  );
}

function LockIcon({ className = 'w-3 h-3' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

// "🔒 time" / "🔒 spot" under a locked tile; the visible word is short by
// design, the sr-only text says what it means.
function LockedSub({ word, spoken }: { word: string; spoken: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <LockIcon />
      <span aria-hidden="true">{word}</span>
      <span className="sr-only">{spoken}</span>
    </span>
  );
}

// Before the RSVP a women-only plan shows a day part and an area, never the
// exact time, venue or a map: the tiles are not tappable.
export function LockedWhenWhereTiles({ dayPart, area }: { dayPart: string | null; area: string | null }) {
  return (
    <div className="flex gap-3">
      <Tile
        icon="🗓️"
        label="WHEN"
        value={dayPart || 'Coming up'}
        valueClass="text-[#FF774D]"
        sub={<LockedSub word="time" spoken="Exact time shared after you RSVP" />}
      />
      <Tile
        icon="📍"
        label="WHERE"
        value={area || 'After you RSVP'}
        sub={<LockedSub word="spot" spoken="Exact place shared after you RSVP" />}
      />
    </div>
  );
}

export function WomenOnlyBanner() {
  return (
    <div className="flex items-start gap-[10px] bg-[#FFF4F1] border border-[#F3E4DD] rounded-[14px] px-3 py-[10px]">
      <WomenOnlyGlyph className="w-[18px] h-[18px] mt-[1px] shrink-0 text-[#C2410C]" />
      <div>
        <b className="block text-[13.5px] text-[#1F1F1F]">Women-only activity</b>
        <span className="text-[12px] text-[#616161]">
          Open to women only. The exact time, place and crew show once you RSVP.
        </span>
      </div>
    </div>
  );
}

// Founder pick R5 (2026-09-28): no crew names or head-count before the RSVP.
// Only the group size is shown.
export function LockedCrewRow({ groupSize }: { groupSize: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-9 h-9 shrink-0 rounded-full grid place-items-center bg-[#F5F3F1] text-[#8A8580]">
        <LockIcon className="w-4 h-4" />
      </span>
      <div className="flex-1 min-w-0 text-[13.5px] text-[#616161]">Crew shown after you RSVP</div>
      {groupSize > 0 && (
        <span className="shrink-0 bg-[#FFF4F1] text-[#B4441F] font-extrabold text-[11.5px] px-[11px] py-[6px] rounded-full whitespace-nowrap">
          Up to {groupSize}
        </span>
      )}
    </div>
  );
}

// Web checkbox, pick W2: the consequence stays in view at the moment she attests.
export function AttestCheckbox({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="mt-3 flex items-start gap-[9px] text-[13px] leading-[1.35] text-[#1F1F1F] cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        required
        aria-required="true"
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={`mt-[1px] w-[18px] h-[18px] shrink-0 rounded-[5px] border-[1.5px] grid place-items-center peer-focus-visible:ring-2 peer-focus-visible:ring-[#FF774D] peer-focus-visible:ring-offset-2 ${
          checked ? 'bg-[#FF774D] border-[#FF774D]' : 'bg-white border-[#9E9E9E]'
        }`}
      >
        {checked && (
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="#1F1F1F" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        )}
      </span>
      <span>
        <b className="font-bold">I&apos;m a woman.</b> Misuse means a ban.
      </span>
    </label>
  );
}

function Tile({ icon, label, value, valueClass = '', sub, onClick, actionHint }: {
  icon: string; label: string; value: string; valueClass?: string; sub?: ReactNode;
  onClick?: () => void; actionHint?: string;
}) {
  const cls = 'flex-1 min-w-0 bg-white border border-[#F0EEEC] rounded-[18px] p-4 shadow-[0_12px_30px_-20px_rgba(31,31,31,0.28)]';
  const inner = (
    <>
      <div className="flex items-start justify-between">
        <div className="w-9 h-9 rounded-[11px] bg-[#FFF4F1] grid place-items-center text-[18px]">{icon}</div>
        {onClick && (
          <span className="inline-flex items-center gap-[3px] text-[10.5px] font-extrabold text-[#E6693F] mt-1">
            {actionHint}
            <svg className="w-[13px] h-[13px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M17 7H9M17 7v8" />
            </svg>
          </span>
        )}
      </div>
      <div className="text-[10.5px] text-[#6E6E6E] font-extrabold tracking-[0.08em] mt-3">{label}</div>
      <div className={`font-[family-name:var(--font-heading)] font-black text-[20px] -tracking-[0.02em] mt-1 leading-tight line-clamp-2 break-words ${valueClass}`}>{value}</div>
      {sub && <div className="text-[12.5px] text-[#616161] font-semibold mt-[3px] truncate">{sub}</div>}
    </>
  );
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`${label}: ${value} — get directions`}
        className={`${cls} text-left active:scale-[0.98] transition-transform hover:border-[#F3C6B6]`}
      >
        {inner}
      </button>
    );
  }
  return <div className={cls}>{inner}</div>;
}

// Bottom-sheet chooser for opening the venue in a maps app. The web can't fire
// the native OS app-picker, so we present the three common targets explicitly.
// Uses coords when we have them (exact pin), else a venue-name search.
export function MapsSheet({ venueName, lat, lng, onClose }: {
  venueName: string; lat: number | null; lng: number | null; onClose: () => void;
}) {
  const sheetRef = useRef<HTMLDivElement>(null);
  // Latest onClose without re-running the mount-once effect (the parent passes
  // an inline closure that changes identity on every teaser-poll re-render).
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; });

  // Lock body scroll, close on Escape, and trap focus within the sheet while
  // open — same dialog contract as WithdrawSheet. Without the trap, Tab walks
  // the claim form behind the aria-modal overlay.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // The WHERE tile (or whatever opened us) gets focus back on close —
    // without this, unmounting the focused sheet node drops focus to <body>
    // and the next Tab restarts from the top of the page.
    const prevFocus = document.activeElement as HTMLElement | null;

    const sheet = sheetRef.current;
    const focusables = () =>
      Array.from(
        sheet?.querySelectorAll<HTMLElement>(
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
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus?.();
    };
  }, []);

  const hasCoords = lat != null && lng != null;
  const coordQ = hasCoords ? `${lat},${lng}` : '';
  const nameQ = encodeURIComponent(venueName);
  const apple = hasCoords ? `https://maps.apple.com/?ll=${coordQ}&q=${nameQ}` : `https://maps.apple.com/?q=${nameQ}`;
  const google = `https://www.google.com/maps/search/?api=1&query=${hasCoords ? coordQ : nameQ}`;
  const waze = hasCoords ? `https://waze.com/ul?ll=${coordQ}&navigate=yes` : `https://waze.com/ul?q=${nameQ}&navigate=yes`;

  const options = [
    { name: 'Apple Maps', href: apple, emoji: '🗺️' },
    { name: 'Google Maps', href: google, emoji: '📍' },
    { name: 'Waze', href: waze, emoji: '🚗' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-label="Open in maps"
      onClick={onClose}
    >
      <div
        ref={sheetRef}
        className="w-full sm:max-w-[360px] bg-white rounded-t-[22px] sm:rounded-[22px] p-4 pb-6 shadow-[0_-10px_40px_-12px_rgba(0,0,0,0.3)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto w-10 h-1 rounded-full bg-[#E5E1DD] mb-3 sm:hidden" />
        <div className="font-[family-name:var(--font-heading)] font-black text-[16px] text-[#1F1F1F] px-1">Get directions</div>
        <div className="text-[13px] text-[#6E6E6E] px-1 mt-0.5 mb-3 truncate">{venueName}</div>
        <div className="space-y-2">
          {options.map((o) => (
            <a
              key={o.name}
              href={o.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="flex items-center gap-3 w-full bg-[#FAFAFA] hover:bg-[#FFF4F1] border border-[#F0EEEC] rounded-[14px] px-4 py-[14px] transition-colors"
            >
              <span className="text-[20px]">{o.emoji}</span>
              <span className="flex-1 font-bold text-[14.5px] text-[#1F1F1F]">{o.name}</span>
              <svg className="w-[16px] h-[16px] text-[#B5B0AB]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
            </a>
          ))}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-full mt-3 py-[13px] rounded-[14px] text-[14px] font-bold text-[#6B6B6B] hover:text-[#1F1F1F] transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// Turn a raw URL into a short, human label: host (no www) + first path segment,
// no query/hash. e.g. https://www.instagram.com/luckycoffeebar?igsh=… → instagram.com/luckycoffeebar
function linkLabel(url: string): string {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');
    const seg = u.pathname.split('/').filter(Boolean)[0];
    const label = seg ? `${host}/${seg}` : host;
    return label.length > 30 ? `${label.slice(0, 29)}…` : label;
  } catch {
    return url;
  }
}

// The stored "Here for…" text is often a raw pasted blob with inline URLs and
// emoji. Linkify URLs into short, tappable labels (stripping ugly query strings)
// while keeping the surrounding text and line breaks intact.
function linkify(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(https?:\/\/[^\s]+)/g;
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    let url = m[0];
    let trail = '';
    const tm = url.match(/[).,;!?'"]+$/); // don't swallow trailing punctuation into the link
    if (tm) { trail = tm[0]; url = url.slice(0, url.length - trail.length); }
    out.push(
      <a
        key={key++}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#E6693F] font-semibold underline decoration-[#F3C6B6] underline-offset-2 break-words"
      >
        {linkLabel(url)} ↗
      </a>,
    );
    if (trail) out.push(trail);
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

// The Captain's Paid tag ("Paid · RM 25 at the gym"), as on the app's plan
// page. A free plan has no tag, so this only ever renders for a paid one.
export function PaidTag({ label }: { label: string }) {
  return (
    <span className="inline-flex max-w-full items-center gap-[7px] rounded-full bg-[#1F1F1F] px-[13px] py-[7px] text-[12.5px] font-bold text-white">
      <svg className="w-[14px] h-[14px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z" />
        <circle cx="7.5" cy="7.5" r="1.2" fill="currentColor" />
      </svg>
      <span className="truncate">{label}</span>
    </span>
  );
}

// The Captain's links (at most three, https only: see planLinks()). Label on
// top, the short address under it, the whole row one 44 pt tap target.
export function PlanLinks({ links }: { links: PlanLink[] }) {
  if (links.length === 0) return null;
  return (
    <ul className="bg-white border-[1.5px] border-[#EDEBE9] rounded-[18px] divide-y divide-[#F0EEEC] overflow-hidden">
      {links.map((link) => (
        <li key={link.url}>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="flex min-h-[52px] items-center gap-3 px-4 py-[10px] hover:bg-[#FFF9F7] transition-colors"
          >
            <span className="w-8 h-8 shrink-0 grid place-items-center rounded-full bg-[#FFF4F1] text-[#E6693F]">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M10 13a5 5 0 0 0 7.1 0l3-3a5 5 0 0 0-7.1-7.1l-1.7 1.7" />
                <path d="M14 11a5 5 0 0 0-7.1 0l-3 3a5 5 0 0 0 7.1 7.1l1.7-1.7" />
              </svg>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[14.5px] font-bold text-[#1F1F1F]">{link.label}</span>
              <span className="block truncate text-[12px] text-[#737373]">{link.shortUrl}</span>
            </span>
            <span className="shrink-0 text-[#B5B0AB]" aria-hidden>↗</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

// The in-app "Here for…" purpose (merged title+details field): 2-line preview + expand.
export function HereFor({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-[#FFF4F1] rounded-[18px] p-4">
      <div className="flex items-center gap-2 font-[family-name:var(--font-heading)] font-extrabold text-[13px] text-[#E6693F]">
        <span className="text-[15px]">🎯</span> Here for…
      </div>
      <div className="flex items-end gap-3 mt-[9px]">
        <p
          className="flex-1 min-w-0 text-[14.5px] leading-[1.5] text-[#1F1F1F] whitespace-pre-line break-words"
          style={open ? undefined : { display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
        >
          {linkify(text)}
        </p>
        <button
          type="button"
          aria-label={open ? 'Show less' : 'See more'}
          onClick={() => setOpen((v) => !v)}
          className="shrink-0 w-[30px] h-[30px] rounded-full bg-white border border-[#F3E4DD] grid place-items-center shadow-[0_4px_10px_-6px_rgba(31,31,31,0.3)]"
        >
          <svg className={`w-[17px] h-[17px] transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="#E6693F" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Web RSVP guests are names only (no photos, by design — phone-verified, never
// public). So the crew is shown as initials in brand-tinted rings, never stock
// avatars. Falls back gracefully when the name list is empty but a count exists.
const AVATAR_TINTS = [
  { bg: '#FFE1D6', fg: '#B4441F' },
  { bg: '#FFEFC9', fg: '#9A6A00' },
  { bg: '#E3F0FF', fg: '#2E6BB8' },
  { bg: '#E6F6EC', fg: '#1F8A55' },
];

// Defensive by design: this renders during the first paint of the whole page, so
// a bad value here is not a blank avatar, it is a white screen. `name` is typed
// `string`, but the teaser RPC has shipped nulls (members with no display_name).
function initial(name: string | null | undefined): string {
  const c = (name ?? '').trim().charAt(0).toUpperCase();
  return /[A-Z0-9]/.test(c) ? c : '🙂';
}

// `total` = participant count (may exceed the named list — web guests aren't all
// named). Shows up to 2 names + "& N more", up to 4 initial avatars, and — when
// there are more names than the preview — taps open to reveal the full list.
export function CrewStack({ names, total, spotsLeft }: { names: (string | null)[]; total: number; spotsLeft: number }) {
  const [open, setOpen] = useState(false);
  // Unnamed participants still count toward `total` ("& 2 more are in") — they
  // just have no name or initial to show.
  const named = Array.isArray(names)
    ? names.filter((n): n is string => typeof n === 'string' && n.trim().length > 0)
    : [];
  const preview = named.slice(0, 2);
  const avatars = named.slice(0, 4);
  const moreCount = Math.max(0, total - preview.length);
  const totalVerb = total === 1 ? 'is in' : 'are in';
  const expandable = named.length > preview.length;

  const summary = (
    <>
      {avatars.length > 0 && (
        <div className="flex shrink-0">
          {avatars.map((n, i) => {
            const t = AVATAR_TINTS[i % AVATAR_TINTS.length];
            return (
              <span
                key={`${n}-${i}`}
                className="w-9 h-9 rounded-full grid place-items-center shadow-[0_0_0_2.5px_#FAFAFA] -ml-3 first:ml-0 font-[family-name:var(--font-heading)] font-extrabold text-[13px]"
                style={{ background: t.bg, color: t.fg }}
              >
                {initial(n)}
              </span>
            );
          })}
        </div>
      )}
      <div className="flex-1 text-[13.5px] text-[#616161] min-w-0 text-left">
        {preview.length > 0 ? (
          <>
            <b className="font-[family-name:var(--font-heading)] font-bold text-[#1F1F1F]">{preview.join(', ')}</b>
            {moreCount > 0 ? ` & ${moreCount} more ${totalVerb}` : ` ${totalVerb}`}
          </>
        ) : total > 0 ? (
          <span><b className="font-[family-name:var(--font-heading)] font-bold text-[#1F1F1F]">{total}</b> {totalVerb}</span>
        ) : (
          <span>Be the first to grab a spot</span>
        )}
      </div>
      {expandable && (
        <svg
          className={`shrink-0 w-[18px] h-[18px] text-[#9E9E9E] transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      )}
    </>
  );

  return (
    <div>
      <div className="flex items-center gap-3">
        {expandable ? (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="flex items-center gap-3 flex-1 min-w-0"
          >
            {summary}
          </button>
        ) : (
          <div className="flex items-center gap-3 flex-1 min-w-0">{summary}</div>
        )}
        {spotsLeft > 0 && (
          <span className="shrink-0 bg-[#FFF4F1] text-[#B4441F] font-extrabold text-[11.5px] px-[11px] py-[6px] rounded-full whitespace-nowrap">
            {spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'} left
          </span>
        )}
      </div>

      {open && (
        <ul className="mt-3 ml-1 space-y-2">
          {named.map((name, i) => (
            <li key={`${name}-${i}`} className="flex items-center gap-2.5 text-[14px] text-[#1F1F1F]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF774D] shrink-0" />
              {name}
            </li>
          ))}
          {total > named.length && (
            <li className="flex items-center gap-2.5 text-[14px] text-[#616161]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E0DCD8] shrink-0" />
              + {total - named.length} more
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

// Who started this — attribution only (Konectr has no host role). The creator
// has a real account (unlike web guests), so a real photo may exist; falls back
// to an initial ring in the brand tint. Tapping tries the app (public profile)
// and falls back to the beta/waitlist path.
export function StartedByRow({
  name,
  photoUrl,
  href,
  onClick,
}: {
  name: string | null | undefined;
  photoUrl?: string | null;
  href?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}) {
  const safeName = (name ?? '').trim();
  const firstName = safeName.split(/\s+/)[0] || safeName || 'Someone';
  const t = AVATAR_TINTS[0];

  const body = (
    <>
      {photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- avatar comes from the Supabase public CDN; next/image remote-pattern config not worth it for a 28px thumb
        <img
          src={photoUrl}
          alt=""
          className="w-7 h-7 rounded-full object-cover shadow-[0_0_0_2px_#FAFAFA] shrink-0"
        />
      ) : (
        <span
          className="w-7 h-7 rounded-full grid place-items-center font-[family-name:var(--font-heading)] font-extrabold text-[11px] shadow-[0_0_0_2px_#FAFAFA] shrink-0"
          style={{ background: t.bg, color: t.fg }}
        >
          {initial(firstName)}
        </span>
      )}
      <span className="text-[13px] text-[#616161]">
        Started by{' '}
        <b className="font-[family-name:var(--font-heading)] font-bold text-[#1F1F1F]">{firstName}</b>
      </span>
      {href && (
        <svg
          className="w-[14px] h-[14px] text-[#B5B0AB] shrink-0"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      )}
    </>
  );

  if (!href) {
    return <div className="flex items-center gap-[9px]">{body}</div>;
  }
  return (
    <a
      href={href}
      onClick={onClick}
      aria-label={`View ${firstName}'s profile in the Konectr app`}
      className="flex items-center gap-[9px] group hover:opacity-80 transition-opacity"
    >
      {body}
    </a>
  );
}

export function TrustLine() {
  return (
    <div className="flex items-center gap-[7px] text-[11.5px] text-[#6B6B6B] mt-[11px] font-medium">
      <svg className="w-[13px] h-[13px]" viewBox="0 0 24 24" fill="none" stroke="#1FA463" strokeWidth={2.3}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
      Only your first name is shown — email is never public
    </div>
  );
}
