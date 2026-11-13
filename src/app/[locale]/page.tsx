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
    title: "Konectr — Meet New People in Kuala Lumpur | Real Activities",
    description:
      "Meet new people in Kuala Lumpur through real activities. Konectr matches you for coffee, hikes, fitness and more, right now. Free on the App Store and Google Play.",
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
