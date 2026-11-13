// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/metadata";
import { ScrapbookLanding } from "@/components/sections/landing/ScrapbookLanding";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: "",
    // City-neutral since the landing page takes its city from the link (konectr-mvp#669).
    // KL stays in the description: it is where most plans run and what people search for.
    title: "Konectr — Meet New People Nearby | Real Activities",
    description:
      "Post a run, a hike or a coffee and people nearby join you. Free on the App Store and Google Play. Most plans today are in Kuala Lumpur.",
  });
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <ScrapbookLanding />
    </main>
  );
}
