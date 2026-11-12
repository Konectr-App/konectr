// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

// Konectr Hub public page: konectr.app/h/{slug} (PF-45, plan task 5). The
// target of a Hub's "Share a plan here" link and its Instagram bio. Outside
// [locale] like /a/ and /c/, so the shared URL never 307s to /en/h/….
//
// Everything comes from get_public_hub_page (anon RPC). The RPC is the gate:
// only is_konectr_hub + is_active venues resolve, anything else 404s.
//
// 🔴 T6: announcement bodies are venue-written. They render as plain text —
// never linkify them, never dangerouslySetInnerHTML them.

import { cache } from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublicHubPage, type PublicHubAnnouncement, type PublicHubPage } from '@/lib/supabase';
import { BASE_URL, SHARE_OG_IMAGE, trimDescription } from '@/lib/metadata';
import { formatTime, getRelativeDayPhrase } from '@/lib/datetime';
import StoreCTAs from '@/components/StoreCTAs';
import Footer from '../../a/[code]/redesign/Footer';

// ISR, same as /c/: Hub pages get shared in bursts; announcements and plans
// can lag by up to 5 minutes (a console takedown included).
export const revalidate = 300;

// Empty list = no hubs at build time, each slug cached on first request. Without
// it Next renders this route per request and `revalidate` is ignored (/c/[key]
// has exactly that: ƒ in the build table).
export function generateStaticParams() {
  return [];
}

type Params = { params: Promise<{ slug: string }> };

// One RPC round-trip per render across generateMetadata + the page.
const getHub = cache(getPublicHubPage);

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; // venue_hours: 0 = Sunday

// Mirrors hub_valid_link(): hub_update_page validates new links, but
// social_links predates Hubs, so older rows are re-checked before we link out.
const LINK_RULES: Record<'instagram' | 'tiktok' | 'maps', { label: string; re: RegExp }> = {
  instagram: { label: 'Instagram', re: /^https:\/\/(www\.)?instagram\.com\/[^?#\s]+/i },
  tiktok: { label: 'TikTok', re: /^https:\/\/(www\.)?tiktok\.com\/@[^?#\s]+/i },
  maps: {
    label: 'Directions',
    re: /^https:\/\/((www\.)?google\.[a-z.]+\/maps|maps\.google\.[a-z.]+\/|maps\.app\.goo\.gl\/|goo\.gl\/maps\/)/i,
  },
};

function to12h(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
}

function heroPhoto(hub: PublicHubPage): string | null {
  return hub.photos[0] ?? hub.photo_url ?? null;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const hub = await getHub(slug);
  if (!hub) return {};

  const url = `${BASE_URL}/h/${hub.slug}`;
  const title = `${hub.name}${hub.city ? `, ${hub.city}` : ''} · Konectr`;
  const description = trimDescription(
    hub.description ||
      `Plans at ${hub.name} on Konectr. See what's on this week and join a plan here.`,
  );
  const photo = heroPhoto(hub);
  // Absolute URLs only: this route is outside the [locale] layout that sets
  // metadataBase, and chat apps drop relative og:images.
  const images = photo ? [photo] : [SHARE_OG_IMAGE];

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, type: 'website', url, images },
    twitter: { card: 'summary_large_image', title, description, images },
  };
}

function Announcement({ a }: { a: PublicHubAnnouncement }) {
  return (
    <li className="rounded-xl border border-black/10 p-4">
      {/* Plain text on purpose (T6): URLs in the body stay unclickable. */}
      <p className="whitespace-pre-line break-words text-sm leading-relaxed text-black/80">{a.body}</p>
      {a.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={a.image_url} alt="" loading="lazy" className="mt-3 w-full rounded-lg object-cover" />
      )}
    </li>
  );
}

export default async function HubPage({ params }: Params) {
  const { slug } = await params;
  const hub = await getHub(slug);
  if (!hub) notFound();

  const photo = heroPhoto(hub);
  const gallery = hub.photos.slice(1, 7);
  const announcements = [...hub.announcements.this_week, ...hub.announcements.this_month];
  const plans = hub.plans.filter((p) => p.share_code);
  const links = (Object.keys(LINK_RULES) as (keyof typeof LINK_RULES)[]).filter((k) => {
    const v = hub.links[k];
    return !!v && v.length <= 300 && !/\s/.test(v) && LINK_RULES[k].re.test(v);
  });

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#1F1F1F]">
      <header className="bg-[#FF774D] px-6 py-4">
        <Link href="/" className="mx-auto flex max-w-lg items-center gap-3">
          <span className="inline-flex items-center rounded-full bg-white px-3 py-1.5">
            <Image src="/logos/konectr-icon-orange.svg" alt="Konectr" width={22} height={22} />
          </span>
          <span className="font-semibold text-white">Konectr</span>
        </Link>
      </header>

      <div className="mx-auto max-w-lg space-y-5 px-6 py-8">
        {/* ── Venue ──────────────────────────────────────────────────────── */}
        <section className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
          {photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt={hub.name} className="aspect-[16/9] w-full object-cover" />
          )}
          <div className="p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-[#FF774D]">Konectr Hub</p>
            <h1 className="mt-2 text-2xl font-bold">{hub.name}</h1>
            {(hub.city || hub.category) && (
              <p className="mt-1 text-sm capitalize text-black/60">
                {[hub.category, hub.city].filter(Boolean).join(' · ')}
              </p>
            )}
            {hub.description && (
              <p className="mt-4 whitespace-pre-line break-words text-sm leading-relaxed text-black/80">
                {hub.description}
              </p>
            )}
            {hub.good_for.length > 0 && (
              <p className="mt-4 text-sm text-black/70">
                <span className="font-semibold">Good for: </span>
                {hub.good_for.map((g) => g.replace(/_/g, ' ')).join(' · ')}
              </p>
            )}
            {links.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {links.map((k) => (
                  <a
                    key={k}
                    href={hub.links[k]!}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="rounded-full border border-black/15 px-3 py-1.5 text-xs font-semibold hover:border-[#FF774D] hover:text-[#FF774D]"
                  >
                    {LINK_RULES[k].label}
                  </a>
                ))}
              </div>
            )}
          </div>
          {gallery.length > 0 && (
            <div className="grid grid-cols-3 gap-1 px-1 pb-1">
              {gallery.map((src) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={src} src={src} alt="" loading="lazy" className="aspect-square w-full rounded object-cover" />
              ))}
            </div>
          )}
        </section>

        {/* ── Announcements ─────────────────────────────────────────────── */}
        {announcements.length > 0 && (
          <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">From {hub.name}</h2>
            <ul className="mt-3 space-y-3">
              {announcements.map((a) => (
                <Announcement key={a.id} a={a} />
              ))}
            </ul>
          </section>
        )}

        {/* ── Perks ─────────────────────────────────────────────────────── */}
        {hub.perks.length > 0 && (
          <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">Perks for Konectr groups</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {hub.perks.map((p) => (
                <li key={`${p.min_group}-${p.title}`} className="flex gap-3">
                  <span className="shrink-0 rounded-full bg-[#FFF5F2] px-2.5 py-0.5 text-xs font-bold text-[#C2410C]">
                    {p.min_group}+
                  </span>
                  <span className="break-words text-black/80">{p.title}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Plans (public only, next 14 days) ─────────────────────────── */}
        <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">Plans at {hub.name}</h2>
          {plans.length > 0 ? (
            <ul className="mt-3 space-y-2.5">
              {plans.map((plan) => (
                <li key={plan.share_code}>
                  <Link
                    href={`/a/${plan.share_code}`}
                    className="flex min-h-14 items-center gap-3 rounded-xl border border-[#EFEFEF] px-3 py-2.5 transition-colors hover:border-[#FF774D]"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-bold">{plan.title}</span>
                      <span className="block truncate text-[13px] text-[#616161]">
                        {getRelativeDayPhrase(plan.start_time)} · {formatTime(plan.start_time)}
                        {plan.headcount ? ` · ${plan.headcount} going` : ' · Small group'}
                      </span>
                    </span>
                    {plan.spots_left != null && (
                      <span className="shrink-0 text-[12px] font-bold text-[#C2410C]">
                        {plan.spots_left === 0
                          ? 'Full'
                          : `${plan.spots_left} ${plan.spots_left === 1 ? 'spot' : 'spots'}`}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-black/60">
              No open plans here in the next two weeks yet. Start the first one.
            </p>
          )}
        </section>

        {/* ── Hours ─────────────────────────────────────────────────────── */}
        {hub.hours.length > 0 && (
          <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">Opening hours</h2>
            <dl className="mt-3 grid grid-cols-[3rem_1fr] gap-y-1 text-sm">
              {hub.hours.map((h) => (
                <div key={h.day_of_week} className="contents">
                  <dt className="font-semibold">{DAYS[h.day_of_week]}</dt>
                  <dd className="text-black/70">
                    {h.is_closed || !h.open_time || !h.close_time
                      ? 'Closed'
                      : `${to12h(h.open_time)} – ${to12h(h.close_time)}`}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* ── Start a plan here (store CTAs, same pair as /hyrox) ───────── */}
        <section className="rounded-2xl bg-[#1F1F1F] p-6 text-center">
          <h2 className="text-xl font-bold text-white">Start a plan at {hub.name}</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/75">
            Pick the activity and a time in the Konectr app. People up for the same
            activity join you at {hub.name}.
          </p>
          <div className="mx-auto mt-5 max-w-[340px]">
            <StoreCTAs platform={null} />
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
