'use client';

// © Konectr 2026. All rights reserved.
// Proprietary and confidential.
//
// Searchable, filterable HYROX gym directory for konectr.app/hyrox.
//
// Deliberately a FLAT list, not tier-then-city groups: with 52 venues the old
// grouping printed the same city twice (once per tier) and read as an endless
// scroll. Tier now lives on the row badge, city on the filter row.
//
// Client component, but every venue is still rendered in the server HTML on
// first paint (default filter = All, empty query), so the directory stays
// crawlable for SEO.

import { useMemo, useState } from 'react';
import type { CampaignVenue } from '@/lib/supabase';

const CERTIFIED = '__certified__';

type Tiered = CampaignVenue & { certified: boolean };

function normalizeUrl(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function prettyUrl(url: string): string {
  return url.replace(/^https?:\/\//i, '').replace(/\/$/, '');
}

export default function GymDirectory({
  certifiedGyms,
  styleGyms,
  cityOrder,
}: {
  certifiedGyms: CampaignVenue[];
  styleGyms: CampaignVenue[];
  cityOrder: string[];
}) {
  const [query, setQuery] = useState('');
  // null = All. Otherwise CERTIFIED or a city name. Single-select: the search
  // box narrows within whatever chip is active.
  const [filter, setFilter] = useState<string | null>(null);

  const rank = useMemo(
    () => (city: string) => {
      const i = cityOrder.indexOf(city);
      return i === -1 ? cityOrder.length : i;
    },
    [cityOrder],
  );

  // Certified first, then campaign city order, then name.
  const all = useMemo<Tiered[]>(() => {
    const merged: Tiered[] = [
      ...certifiedGyms.map((v) => ({ ...v, certified: true })),
      ...styleGyms.map((v) => ({ ...v, certified: false })),
    ];
    return merged.sort((a, b) => {
      if (a.certified !== b.certified) return a.certified ? -1 : 1;
      const ra = rank(a.city ?? '');
      const rb = rank(b.city ?? '');
      if (ra !== rb) return ra - rb;
      const city = (a.city ?? '').localeCompare(b.city ?? '');
      if (city !== 0) return city;
      return a.venue_name.localeCompare(b.venue_name);
    });
  }, [certifiedGyms, styleGyms, rank]);

  const cityCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const v of all) {
      const city = (v.city ?? '').trim();
      if (!city) continue;
      counts.set(city, (counts.get(city) ?? 0) + 1);
    }
    return Array.from(counts.entries()).sort((a, b) => {
      const ra = rank(a[0]);
      const rb = rank(b[0]);
      if (ra !== rb) return ra - rb;
      if (b[1] !== a[1]) return b[1] - a[1];
      return a[0].localeCompare(b[0]);
    });
  }, [all, rank]);

  const certifiedCount = certifiedGyms.length;

  // Name, address and city are all searchable — the address is not shown on
  // the row but is how people find "the one in Bangsar".
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter((v) => {
      if (filter === CERTIFIED && !v.certified) return false;
      if (filter !== null && filter !== CERTIFIED && v.city !== filter) return false;
      if (!q) return true;
      return (
        v.venue_name.toLowerCase().includes(q) ||
        (v.address ?? '').toLowerCase().includes(q) ||
        (v.city ?? '').toLowerCase().includes(q)
      );
    });
  }, [all, filter, query]);

  const resultLabel = query.trim()
    ? `${results.length} ${results.length === 1 ? 'match' : 'matches'}`
    : results.length === all.length
      ? `${all.length} gyms`
      : `${results.length} of ${all.length} gyms`;

  const chipClass = (active: boolean) =>
    `shrink-0 rounded-full px-3.5 py-1.5 text-[12.5px] font-bold border transition-colors ${
      active
        ? 'bg-[#FFF4F1] border-[#FF774D] text-[#E6693F]'
        : 'bg-white border-[#F0EEEC] text-[#444] hover:border-[#FF774D]'
    }`;

  return (
    <div className="mt-5">
      {/* ── Search ────────────────────────────────────────────────────────── */}
      <div className="relative">
        <span
          aria-hidden
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[15px] text-[#9E9E9E]"
        >
          🔍
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search gym or area"
          aria-label="Search HYROX gyms by name or area"
          className="w-full rounded-[14px] border border-[#F0EEEC] bg-white py-3 pl-10 pr-10 text-[14px] text-[#1F1F1F] placeholder:text-[#9E9E9E] outline-none focus:border-[#FF774D] focus:ring-2 focus:ring-[#FF774D]/20"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[15px] text-[#9E9E9E] hover:text-[#1F1F1F] transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* ── Filter chips ──────────────────────────────────────────────────── */}
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          type="button"
          onClick={() => setFilter(null)}
          aria-pressed={filter === null}
          className={chipClass(filter === null)}
        >
          All {all.length}
        </button>
        {certifiedCount > 0 && (
          <button
            type="button"
            onClick={() => setFilter(CERTIFIED)}
            aria-pressed={filter === CERTIFIED}
            className={chipClass(filter === CERTIFIED)}
          >
            Certified {certifiedCount}
          </button>
        )}
        {cityCounts.map(([city, count]) => (
          <button
            key={city}
            type="button"
            onClick={() => setFilter(city)}
            aria-pressed={filter === city}
            className={chipClass(filter === city)}
          >
            {city} {count}
          </button>
        ))}
      </div>

      {/* ── Count + tier key ──────────────────────────────────────────────── */}
      <p aria-live="polite" className="mt-3 text-[13px] font-semibold text-[#616161]">
        {resultLabel}
      </p>
      {/* Nominative-use guard: the tier distinction must stay legible now that
          the "not affiliated" tier header is gone. */}
      <p className="mt-1 text-[12px] leading-[1.5] text-[#9E9E9E]">
        Certified = official HYROX gym. HYROX-style gyms run similar
        training and are not affiliated.
      </p>

      {/* ── Results ───────────────────────────────────────────────────────── */}
      {results.length === 0 ? (
        <div className="mt-5 rounded-[16px] bg-[#FFF4F1] p-5 text-center">
          <p className="font-[family-name:var(--font-heading)] font-extrabold text-[15px] text-[#1F1F1F]">
            No gyms match {query.trim() ? `“${query.trim()}”` : 'that filter'}
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setFilter(null);
            }}
            className="mt-2 text-[13px] font-bold text-[#FF774D] hover:text-[#E6693F] transition-colors"
          >
            Show all {all.length} gyms
          </button>
        </div>
      ) : (
        <ul className="mt-4 space-y-2">
          {results.map((v) => (
            <li
              key={v.venue_id}
              className="rounded-[14px] border border-[#F0EEEC] bg-white px-4 py-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-[family-name:var(--font-heading)] font-extrabold text-[15px] text-[#1F1F1F]">
                    {v.venue_name}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span
                      className={`inline-block rounded-full border px-2 py-0.5 text-[11px] font-extrabold ${
                        v.certified
                          ? 'border-[#FF774D] text-[#E6693F]'
                          : 'border-[#E0DEDC] text-[#6B6B6B]'
                      }`}
                    >
                      {v.certified ? 'Certified' : 'HYROX-style'}
                    </span>
                    {v.city && (
                      <span className="text-[12.5px] text-[#6B6B6B]">· {v.city}</span>
                    )}
                  </div>
                </div>
                {v.website && (
                  <a
                    href={normalizeUrl(v.website)}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="shrink-0 text-[12.5px] font-bold text-[#FF774D] hover:text-[#E6693F] transition-colors"
                  >
                    {prettyUrl(v.website).length > 22
                      ? 'Website ↗'
                      : `${prettyUrl(v.website)} ↗`}
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
