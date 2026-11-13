// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { HowItWorksContent } from "./HowItWorksContent";
import { generateBreadcrumbSchema, generateHowToSchema } from "@/lib/seo";
import { buildPageMetadata } from "@/lib/metadata";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: "/how-it-works",
    title: "How Konectr Works — Activity-First Matching in KL",
    description:
      "Pick the activity, see who's joining, meet at the spot. How Konectr turns intent into real-life meetups in Kuala Lumpur in three steps.",
  });
}

export default async function HowItWorksPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `/${locale}` },
    { name: "How It Works", url: `/${locale}/how-it-works` },
  ]);

  const howToSchema = generateHowToSchema(
    "How to Make Friends with Konectr",
    "Find real people for real activities in 3 simple steps",
    [
      {
        name: "Pick Your Activity",
        text: "Pick from 58 activities, from coffee and running to karaoke and pottery. Set a time window and the group size.",
      },
      {
        name: "People Join",
        text: "Post the activity, the place and a time window. People nearby who are up for the same plan join you.",
      },
      {
        name: "Meet at the Spot",
        text: "Show up at a public venue and meet your group. Whoever starts the plan picks the size, and the featured venues in our hubs are hand-picked for safety and atmosphere.",
      },
    ]
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <PageHeader
        title="How Konectr Works"
        subtitle="Find your people in three simple steps"
        badge="Simple & Spontaneous"
        gradient="secondary"
      />
      <HowItWorksContent />
    </>
  );
}
