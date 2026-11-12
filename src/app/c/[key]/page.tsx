// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

// Campaign hub landing: konectr.app/c/{campaign_key}. One AASA wildcard
// ("/c/*") makes every current and future tag hub app-openable — users with
// the app never see this page. For everyone else it is a light lander:
// campaign card + smart open-in-app CTA, same conversion pattern as /a/[code].

import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getCampaignByKey } from '@/lib/supabase';
import { BASE_URL, SHARE_OG_IMAGE, trimDescription } from '@/lib/metadata';
import SmartDownloadLink from '@/components/SmartDownloadLink';

// ISR: campaign config is slow-moving; hubs are shared in chat bursts.
export const revalidate = 300;

// Empty list = each key cached on first request. Without it Next renders this
// route per request and `revalidate` is ignored (ƒ in the build table).
export function generateStaticParams() {
  return [];
}

type Params = { params: Promise<{ key: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { key } = await params;
  const campaign = await getCampaignByKey(key);
  if (!campaign) return {};

  const title = `${campaign.short_label} on Konectr`;
  const description = trimDescription(
    `${campaign.race_name} — ${campaign.date_label}. Join sessions and meet ` +
      `people on Konectr. Don't go alone.`,
  );

  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/c/${campaign.campaign_key}` },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${BASE_URL}/c/${campaign.campaign_key}`,
      // Absolute URL on purpose: this route is outside the [locale] layout
      // that sets metadataBase, and chat apps drop relative og:images.
      images: [SHARE_OG_IMAGE],
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function CampaignHubPage({ params }: Params) {
  const { key } = await params;
  const campaign = await getCampaignByKey(key);
  if (!campaign) notFound();

  const isEvent = (campaign.kind ?? 'event') === 'event';

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#1F1F1F]">
      <header className="bg-[#FF774D] px-6 py-4">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <span className="inline-flex items-center rounded-full bg-white px-3 py-1.5">
            <Image
              src="/logos/konectr-icon-orange.svg"
              alt="Konectr"
              width={22}
              height={22}
            />
          </span>
          <span className="font-semibold text-white">Konectr</span>
        </div>
      </header>

      <div className="mx-auto max-w-lg px-6 py-10">
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-[#FF774D]">
            {isEvent ? 'Event hub' : 'Community hub'}
          </p>
          <h1 className="mt-2 text-2xl font-bold">{campaign.race_name}</h1>
          <p className="mt-2 text-sm text-black/60">
            {campaign.date_label} · {campaign.venue_label}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-black/80">
            Sessions, curated spots, and people to go with — all in the
            Konectr app.
          </p>

          <SmartDownloadLink
            code={campaign.campaign_key}
            kind="campaign"
            className="mt-6 block w-full rounded-xl bg-[#FF774D] px-6 py-3.5 text-center font-semibold text-[#1F1F1F] transition-colors hover:bg-[#e5663f]"
          >
            Open in Konectr
          </SmartDownloadLink>
        </div>

        <p className="mt-6 text-[11px] leading-relaxed text-black/40">
          {campaign.disclaimer}
        </p>
        <p className="mt-4 text-center text-xs text-black/40">
          konectr.app · Your plan. New people. Nearby.
        </p>
      </div>
    </main>
  );
}
