// © Konectr 2026. All rights reserved.
// Proprietary and confidential.
'use client';

// Public weekly show-up leaderboard (KL). Kinetic Brand Design System v3.0 tokens:
// Sunset Orange #FF774D · Solar Amber #FFC845 · Graphite #1F1F1F · Cloud White #FAFAFA
// tint #FFF4F1 · hover #E6693F — same palette as /a/[code]/redesign/KineticUI.tsx.
//
// Ranked by completed activities (`verified_meetups`), points break ties.
// Privacy: rows render ONLY what the anon RPC returns (first name, photo, weekly
// score, completed count, champion flag). The tap "glance" deliberately shows
// nothing new — full profiles live only inside the app (founder decision); the
// glance is a download driver.

import { useCallback, useEffect, useRef, useState } from 'react';
import type { LeaderboardEntry } from '@/lib/supabase';
import { usePrimaryCta } from '@/lib/usePrimaryCta';

// Platform-aware store link; this page sits outside [locale], so the waitlist
// fallback needs an explicit locale.
function useGetKonectrHref(): string {
  const cta = usePrimaryCta('leaderboard');
  return cta.href === '#waitlist' ? '/en#waitlist' : cta.href;
}

const AVATAR_TINTS = [
  { bg: '#FFE1D6', fg: '#B4441F' },
  { bg: '#FFEFC9', fg: '#9A6A00' },
  { bg: '#E3F0FF', fg: '#2E6BB8' },
  { bg: '#E6F6EC', fg: '#1F8A55' },
];

function initial(name: string): string {
  const c = name.trim().charAt(0).toUpperCase();
  return /[A-Z0-9]/.test(c) ? c : '🙂';
}

function Avatar({ entry, index, size = 44 }: { entry: LeaderboardEntry; index: number; size?: number }) {
  const t = AVATAR_TINTS[index % AVATAR_TINTS.length];
  if (entry.photo_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={entry.photo_url}
        alt=""
        width={size}
        height={size}
        className="rounded-full object-cover shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      className="rounded-full grid place-items-center shrink-0 font-[family-name:var(--font-heading)] font-extrabold"
      style={{ width: size, height: size, background: t.bg, color: t.fg, fontSize: size * 0.36 }}
    >
      {initial(entry.first_name)}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Glance sheet — a download driver, not an info surface. Shows nothing beyond
// what the row already displayed.
// ---------------------------------------------------------------------------
function GlanceSheet({
  entry,
  index,
  period,
  onClose,
}: {
  entry: LeaderboardEntry;
  index: number;
  period: string;
  onClose: () => void;
}) {
  const getKonectrHref = useGetKonectrHref();
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Focus trap + Esc + body scroll lock (same a11y treatment as WithdrawSheet)
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && sheetRef.current) {
        const focusables = sheetRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      prev?.focus();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-[#1F1F1F]/45"
      />
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${entry.first_name} on Konectr`}
        className="relative w-full sm:w-[400px] bg-[#FAFAFA] rounded-t-[26px] sm:rounded-[26px] p-6 pb-8 sm:pb-6 shadow-[0_-12px_40px_-12px_rgba(31,31,31,0.35)]"
      >
        <button
          ref={closeRef}
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white border border-[#F0EEEC] grid place-items-center text-[#6E6E6E]"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col items-center text-center">
          <Avatar entry={entry} index={index} size={72} />
          <div className="mt-3 flex items-center gap-1.5 font-[family-name:var(--font-heading)] font-black text-[22px] -tracking-[0.02em] text-[#1F1F1F]">
            {entry.first_name}
            {entry.is_champion && <span title="KL Champion">🏆</span>}
          </div>
          <div className="mt-1 text-[13.5px] text-[#616161] font-semibold">
            {entry.verified_meetups} completed{' '}
            {entry.verified_meetups === 1 ? 'activity' : 'activities'} · {entry.score} pts {period}
          </div>

          <p className="mt-5 text-[14px] leading-[1.55] text-[#444]">
            Full profile, badges &amp; activity live in the Konectr app.
          </p>

          <a
            href={getKonectrHref}
            className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-[#FF774D] hover:bg-[#E6693F] text-[#1F1F1F] font-[family-name:var(--font-heading)] font-extrabold text-[15px] px-6 py-[14px] rounded-full transition-colors"
          >
            Get Konectr
          </a>
          <div className="flex items-center gap-[7px] text-[11.5px] text-[#6B6B6B] mt-[11px] font-medium">
            <svg className="w-[13px] h-[13px]" viewBox="0 0 24 24" fill="none" stroke="#1FA463" strokeWidth={2.3}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
            Email-verified — real people only
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Board
// ---------------------------------------------------------------------------
type Tab = 'this' | 'last';

export default function LeaderboardBoard({
  thisWeek,
  lastWeek,
  thisWeekLabel,
  lastWeekLabel,
}: {
  thisWeek: LeaderboardEntry[];
  lastWeek: LeaderboardEntry[];
  thisWeekLabel: string;
  lastWeekLabel: string;
}) {
  const getKonectrHref = useGetKonectrHref();
  const [tab, setTab] = useState<Tab>('this');
  const [glance, setGlance] = useState<{ entry: LeaderboardEntry; index: number } | null>(null);
  const [copied, setCopied] = useState(false);

  const entries = tab === 'this' ? thisWeek : lastWeek;
  const weekLabel = tab === 'this' ? thisWeekLabel : lastWeekLabel;

  const copySummary = useCallback(async () => {
    const lines = entries
      .slice(0, 10)
      .map(
        (e) =>
          `${e.rank}. ${e.first_name}${e.is_champion ? ' 🏆' : ''} — ${e.verified_meetups} completed · ${e.score} pts`
      );
    const text = [
      `🏆 Konectr KL Leaderboard — ${weekLabel}`,
      ...lines,
      '',
      'Show up. Get verified. Top the board 👉 https://konectr.app/leaderboard',
    ].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (old browser / permissions) — no-op
    }
  }, [entries, weekLabel]);

  return (
    <main className="min-h-[100dvh] bg-[#FAFAFA]">
      {/* Header */}
      <header className="bg-[#FF774D] px-5 pt-6 pb-14">
        <div className="max-w-[480px] mx-auto">
          <a href="https://konectr.app" className="inline-flex items-center gap-2">
            <span className="bg-white rounded-full px-3 py-1.5 inline-flex items-center gap-1.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logos/konectr-icon-orange.svg" alt="" width={16} height={16} />
              <span className="font-[family-name:var(--font-heading)] font-extrabold text-[13px] text-[#1F1F1F]">
                Konectr
              </span>
            </span>
          </a>
          <h1 className="mt-4 font-[family-name:var(--font-heading)] font-black text-[26px] leading-tight -tracking-[0.02em] text-white">
            KL Weekly Leaderboard 🏆
          </h1>
          <p className="mt-1 text-[13.5px] text-white/85 font-medium">
            Who actually showed up — verified in the app, not just talked about.
          </p>
        </div>
      </header>

      <div className="max-w-[480px] mx-auto px-5 -mt-8 pb-16">
        {/* Card */}
        <section className="bg-white border border-[#F0EEEC] rounded-[22px] shadow-[0_18px_44px_-24px_rgba(31,31,31,0.3)] overflow-hidden">
          {/* Tabs */}
          <div className="flex gap-2 p-4 pb-0" role="tablist" aria-label="Week">
            {(
              [
                { key: 'this' as Tab, label: 'This week', badge: 'live' },
                { key: 'last' as Tab, label: 'Last week', badge: 'final' },
              ]
            ).map((t) => (
              <button
                key={t.key}
                role="tab"
                aria-selected={tab === t.key}
                onClick={() => setTab(t.key)}
                className={`flex-1 rounded-full px-4 py-[9px] text-[13.5px] font-[family-name:var(--font-heading)] font-extrabold transition-colors ${
                  tab === t.key
                    ? 'bg-[#1F1F1F] text-white'
                    : 'bg-[#F5F3F1] text-[#616161] hover:bg-[#EEEBE8]'
                }`}
              >
                {t.label}
                <span className={`ml-1.5 text-[10.5px] font-bold uppercase tracking-[0.06em] ${tab === t.key ? 'text-[#FFC845]' : 'text-[#9E9E9E]'}`}>
                  · {t.badge}
                </span>
              </button>
            ))}
          </div>

          <div className="px-4 pt-3 pb-1 text-[12px] text-[#9E9E9E] font-semibold">{weekLabel}</div>

          {/* Rows */}
          {entries.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="text-[34px]">🌱</div>
              <p className="mt-3 font-[family-name:var(--font-heading)] font-extrabold text-[16px] text-[#1F1F1F]">
                No completed activities {tab === 'this' ? 'yet this week' : 'last week'}
              </p>
              <p className="mt-1.5 text-[13.5px] leading-[1.5] text-[#616161]">
                Show up, confirm your meetup in the app, and claim the top spot.
              </p>
              <a
                href={getKonectrHref}
                className="mt-5 inline-flex items-center justify-center bg-[#FF774D] hover:bg-[#E6693F] text-[#1F1F1F] font-[family-name:var(--font-heading)] font-extrabold text-[14px] px-6 py-3 rounded-full transition-colors"
              >
                Get Konectr
              </a>
            </div>
          ) : (
            <ul className="px-2 pb-2 pt-1">
              {entries.map((e, i) => (
                <li key={`${e.rank}-${e.first_name}-${i}`}>
                  <button
                    type="button"
                    onClick={() => setGlance({ entry: e, index: i })}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-[16px] hover:bg-[#FFF4F1] transition-colors text-left"
                  >
                    <span
                      className={`w-7 shrink-0 text-center font-[family-name:var(--font-heading)] font-black text-[16px] ${
                        e.rank === 1 ? 'text-[#FF774D]' : e.rank <= 3 ? 'text-[#1F1F1F]' : 'text-[#9E9E9E]'
                      }`}
                    >
                      {e.rank}
                    </span>
                    <Avatar entry={e} index={i} />
                    <span className="flex-1 min-w-0">
                      <span className="flex items-center gap-1.5 font-[family-name:var(--font-heading)] font-extrabold text-[15.5px] text-[#1F1F1F] truncate">
                        {e.first_name}
                        {e.is_champion && <span title="KL Champion" className="text-[14px]">🏆</span>}
                      </span>
                      <span className="block text-[12.5px] text-[#616161] font-medium">
                        {e.score} pts
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="block font-[family-name:var(--font-heading)] font-black text-[18px] text-[#1F1F1F]">
                        {e.verified_meetups}
                      </span>
                      <span className="block text-[10.5px] font-extrabold tracking-[0.08em] text-[#9E9E9E]">
                        DONE
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Copy summary — the founder's Monday WhatsApp ritual + free share feature */}
        {entries.length > 0 && (
          <button
            type="button"
            onClick={copySummary}
            className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-white border border-[#F0EEEC] hover:border-[#FF774D] text-[#1F1F1F] font-[family-name:var(--font-heading)] font-extrabold text-[14px] px-6 py-[13px] rounded-full transition-colors"
          >
            {copied ? '✓ Copied — paste it in the group' : '📋 Copy summary for WhatsApp'}
          </button>
        )}

        {/* Scoring legend + opt-in note */}
        <section className="mt-6 bg-[#FFF4F1] rounded-[18px] p-4">
          <div className="font-[family-name:var(--font-heading)] font-extrabold text-[13px] text-[#E6693F]">
            How ranking works
          </div>
          <p className="mt-2 text-[13px] leading-[1.5] text-[#444]">
            Ranked by <b>completed activities</b>. Points come from activities Konectr confirms you attended.
          </p>
          <p className="mt-3 text-[12px] leading-[1.5] text-[#6B6B6B]">
            Opt in from Konectr → Settings → Privacy. Only your first name, photo and
            weekly count appear here — nothing else, ever.
          </p>
        </section>

        <footer className="mt-8 text-center text-[12px] text-[#9E9E9E] font-medium">
          <a href="https://konectr.app" className="hover:text-[#FF774D] transition-colors">
            konectr.app
          </a>{' '}
          · Your plan. New people. Nearby.
        </footer>
      </div>

      {glance && (
        <GlanceSheet
          entry={glance.entry}
          index={glance.index}
          period={tab === 'this' ? 'this week' : 'last week'}
          onClose={() => setGlance(null)}
        />
      )}
    </main>
  );
}
